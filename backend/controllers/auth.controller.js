const User = require("../models/user.models");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    try{
        const savedUser = await user.save();
        res.status(200).json({message: "Created successfully", data: savedUser});
    } catch(err) {
        res.json(400).json({message: "Something went wrong"});
    }
}

exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({username: username, password: password});
        if (!user) return res.status(404).json({message: "Not found"});

        const accessToken = jwt.sign({userId: user._id.toString()}, `${process.env.JWT_ACCESS_SECRET}`, {expiresIn: 30});

        req.user = user;
        console.log(user);
        return res.json({message: "Login success", data: {accessToken}});
    } catch (error){
        console.log(error);
        return res.status(401).json({message: "Login failed"});
    }
}