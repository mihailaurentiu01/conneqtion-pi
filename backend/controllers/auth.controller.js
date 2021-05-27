const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redisClient = require("../redis_connect");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const {validationResult} = require("express-validator");
const crypto = require("crypto");


exports.signup = async (req, res, next) => {
    let errors = validationResult(req);
    const errorsBack = [];

    if (!errors.isEmpty()){
        errors.errors.map(error => errorsBack.push(error.msg));

        return res.status(401).json({errors: errorsBack});
    }

    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);

    const user = new User({
        email: req.body.email,
        password: encryptedPassword,
        username: req.body.username,
        fullName: req.body.name,
        birthDate: req.body.birthDate,
        location: req.body.location
    });

    try{
        await user.save();
        return res.status(200).json({message: "Created successfully. Now you can log in"});
    } catch(error) {
        if (!error.httpStatusCode){
            error.httpStatusCode = 500;
            error.message = "Server-Side error. Try again later";
        }

        return next(error);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({email});

        if (!user) return res.status(404).json({message: "No user is registered with the provided email", status: 404});

        const passesCheck = await bcrypt.compare(password, user.password);

        if (!passesCheck) return res.status(401).json({message: "Password doesn't match", status: 401});

        const accessToken = jwt.sign({userId: user._id.toString()}, process.env.JWT_ACCESS_SECRET,
            {expiresIn: process.env.JWT_ACCESS_TIME});

        const refreshToken = this.generateRefreshToken(user._id.toString());

        res.setHeader("Set-Cookie", cookie.serialize("RefreshToken", refreshToken, {httpOnly: true, path: "/", secure: true, maxAge: +process.env.HTTP_ONLY_COOKIE_MAX_AGE}));
        res.status(200).json({message: "Login success", accessToken, userId: user._id, status: 200});

        user.online = true;
        user.save();

    } catch (error){
        if (!error.httpStatusCode){
            error.httpStatusCode = 500;
            error.message = "Server-Side error. Please try again later";
        }

        return next(error);
    }


}

exports.generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign({userId}, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_TIME});

    redisClient.get(userId.toString(), (err, data) => {
        if (err) throw err;

        redisClient.set(userId.toString(), JSON.stringify({token: refreshToken}));
    })

    return refreshToken;
}

exports.logout = async (req, res, next) => {
    const userId = req.user._id;
    req.user.online = false;
    const {notifications} = req.body;

    // check notifications
    if (notifications.length > 0){
        let notif = notifications.map(notification => {
            if (notification.type === "friendship"){
                return {notification: {userThatSentFriendship: notification.userThatSentFriendship}, type: notification.type}
            }
        });

        notif.map(noti => {
            req.user.notifications.push(noti);
        });
    }

    // Delete refresh token for given user id
    await redisClient.del(userId.toString());

    // Blacklist access token
    await redisClient.set("BL_" + userId.toString(), req.token);

    req.user.save();
    return res.status(200).json({message: "Successfully logged out"})
}

exports.getAccessToken = (req, res, next) => {
    const userId = req.user.userId;

    const accessToken = jwt.sign({userId: userId}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME});
    const refreshToken = this.generateRefreshToken(userId);

    res.setHeader("Set-Cookie", cookie.serialize("RefreshToken", refreshToken, {httpOnly: true, path: "/", secure: true, maxAge: +process.env.HTTP_ONLY_COOKIE_MAX_AGE}));
    return res.status(200).json({message: "Successfully re-generated token.", data: {accessToken}});
}

exports.forgotPassword = (req, res, next) => {
    const {email} = req.body;

    User.findOne({email: email}).then(user => {
        if (user){
            crypto.randomBytes(32, (err, buf) => {
                if (err){
                    console.log(err);
                    res.httpStatusCode = 500;
                    throw err;
                }

                const token = buf.toString("hex");

                user.resetToken = token;
                user.resetTokenExpires = Date.now() + 3600000;

                return user.save().then(() => {
                    transporter.sendMail({
                        to: email,
                        from: "admin@conneqtion.com",
                        subject: "Reset your password",
                        html: `
                            <html>
                                <body>
                                        <p>You requested a password reset</p>
                                         <p>http://localhost:3000/auth/reset/${token}</p>
                                </body>
                            </html>`
                    }).catch(error =>{
                        if (!error.httpStatusCode){
                            error.httpStatusCode = 500;
                            error.message = "Server-Side error. Please try again later";
                        }

                        return next(error);
                    });
                });
            });
        }

        return res.status(200).json({msg: "If the address provided exists, an email has been sent to it with a link to reset the password"});
    }).catch(error => {
        if (!error.httpStatusCode){
            error.httpStatusCode = 500;
            error.message = "Server-Side error. Please try again later";
        }

        return next(error);
    })
}

exports.resetPassword = (req, res, next) => {
    const token = req.params.token;

    User.findOne({resetToken: token, resetTokenExpires: {$gt: Date.now()}}).then(user => {
        if (!user){
            const error = new Error();
            error.httpStatusCode = 404;
            error.message = "Token expired";
            throw error;
        }

        res.status(200).json({msg: "Now you can reset your password", userId: user._id.toString(), token: token});
    })
}