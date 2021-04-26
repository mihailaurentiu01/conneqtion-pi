const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redisClient = require("../redis_connect");
const bcrypt = require("bcrypt");

// TODO ADD VALIDATION
exports.register = async (req, res, next) => {
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);

    const user = new User({
        email: req.body.email,
        password: encryptedPassword
    });

    try{
        const savedUser = await user.save();
        res.status(200).json({message: "Created successfully", data: savedUser});
    } catch(error) {
        if (!error.httpStatusCode){
            error.httpStatusCode = 500;
            error.message = "Server-Side error. Try again later";
        }

        return next(error);
    }
}

// TODO ADD VALIDATION
exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({email});

        if (!user) return res.status(404).json({message: "No user is registered with the provided email"});

        const passesCheck = await bcrypt.compare(password, user.password);

        if (!passesCheck) return res.status(401).json({message: "Password doesn't match"});

        const accessToken = jwt.sign({userId: user._id.toString()}, process.env.JWT_ACCESS_SECRET,
            {expiresIn: process.env.JWT_ACCESS_TIME});

        const refreshToken = this.generateRefreshToken(user._id.toString());

        return res.status(200).json({message: "Login success", data: {accessToken, refreshToken}});
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
    const userId = req.user.userId;

    // Delete refresh token for given user id
    await redisClient.del(userId.toString());

    // Blacklist access token
    await redisClient.set("BL_" + userId.toString(), req.token);

    return res.status(200).json({message: "Successfully logged out"})
}

exports.getAccessToken = (req, res, next) => {
    const userId = req.user.userId;

    const accessToken = jwt.sign({userId: userId}, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_TIME});
    const refreshToken = this.generateRefreshToken(userId);

     return res.status(200).json({message: "Successfully re-generated token.", data: {accessToken, refreshToken}});
}