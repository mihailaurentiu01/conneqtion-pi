const User = require("../models/user.model");
const socket = require("../sockets/socket");

exports.search = (req, res, next) => {
    let query = req.query.query;
    /*console.log(req.cookies);*/

    const regexSearch = new RegExp(query, 'i');

    User.find({fullName: {$regex: regexSearch}, '_id': {$ne: req.user._id}}).then(data => {
        const friendsFound =  [];
        data.map(user => {
            friendsFound.push({fullName: user.fullName, birthDate: user.birthDate, location: user.location, online: user.online, id: user._id});
        });

        res.status(200).json({friendsFound});
    }).catch(err => console.log(err));
}

exports.test = (req, res, next) => {
    res.status(200).json({message: "SUCCESS"});
}

exports.addFriend = (req, res, next) =>{
    const userToAddAsFriend = req.body.userToAddAsFriend;

    // simulate accept
    User.findById({'_id': userToAddAsFriend}).then(userToAddAsFriend  => {
        req.user.friends.push(userToAddAsFriend);
        userToAddAsFriend.friends.push(req.user);

        req.user.save();
        userToAddAsFriend.save();

        const io = socket.getIo();
        io.emit("friends", {action: "Added Friend", who: {fullName: userToAddAsFriend.fullName, email: userToAddAsFriend.email}})

        return res.status(200).json({message: "Friend added successfully"});
    }).catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    })
}