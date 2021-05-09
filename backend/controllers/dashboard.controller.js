const User = require("../models/user.model");

exports.search = (req, res, next) => {
    let query = req.query.query;
    /*console.log(req.cookies);*/

    const regexSearch = new RegExp(query, 'i');

    User.find({fullName: {$regex: regexSearch}, '_id': {$ne: req.user.userId}}).then(data => {
        const friendsFound =  [];
        data.map(user => {
            friendsFound.push({fullName: user.fullName, birthDate: user.birthDate, location: user.location, online: user.online})
        });

        res.status(200).json({friendsFound});
    }).catch(err => console.log(err));
}

exports.test = (req, res, next) => {
    res.status(200).json({message: "SUCCESS"});
}