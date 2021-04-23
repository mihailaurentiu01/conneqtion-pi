const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (!decoded) return;

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({message: "Invalid token"});
    }
}