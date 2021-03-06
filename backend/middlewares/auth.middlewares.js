const jwt = require("jsonwebtoken");
const redisClient = require("../redis_connect");
const User = require("../models/user.model");

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (!decoded) {
            const error = new Error();
            error.httpStatusCode = 400;
            error.message = "Unable to verify token validity";
            return next(error);
        }


        req.token = token;

        let user  = await User.findById(decoded.userId);

        req.user = user;
        redisClient.get("BL_" + decoded.userId.toString(), (err, data) => {
            if (err) throw err;

            if (data === token) return res.status(403).json({message: "Unable to verify the token validity"})

            next();
        });
    } catch (error) {
        console.log(error);
        if (!error.httpStatusCode){
            error.httpStatusCode = 401;
            error.message = "Invalid token";
        }

        return next(error);
    }
}

exports.verifyRefreshToken = (req, res, next) => {
    const token = req.cookies["RefreshToken"];

    if (!token) return res.status(401).json({message: "Invalid token"});

    try{
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        if (!decoded) {
            const error = new Error();
            error.httpStatusCode = 400;
            error.message = "Unable to verify token validity";
            return next(error);
        }

        req.user = decoded;

        redisClient.get(decoded.userId.toString(), (err, data) => {
            if (err) throw err;

            if (data === null) return res.status(401).json({message: 'Invalid request. No actual token was found for the given user.'})
            if (JSON.parse(data).token !== token) return res.status(401).json({message: 'Invalid request. Token is not the same'});

            next();
        });
    } catch (error){
        if (!error.httpStatusCode){
            error.httpStatusCode = 401;
            error.message = "Token was unable to be verified";
        }

        return next(error);
    }
}

exports.verifyAdmin = (req, res, next) => {
    if (req.user.role === 'Admin'){
        return next();
    }else{
        const error = new Error("No admin privilege found");
        error.httpStatusCode = 403;

        return next(error);
    }
}