const User = require("../models/user.model");

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({users});
}