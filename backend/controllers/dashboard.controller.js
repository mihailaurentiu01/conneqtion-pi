const User = require("../models/user.model");
const socketIo = require("../sockets/socket");

exports.search = (req, res, next) => {
    let query = req.query.query;
    /*console.log(req.cookies);*/

    const regexSearch = new RegExp(query, 'i');

    User.find({fullName: {$regex: regexSearch}, '_id': {$ne: req.user._id}}).then(data => {
        const friendsFound = [];

        data.map(user => {
            if (req.user.friends.length > 0){
                let isFriend = false;
                for(let i = 0; i < req.user.friends.length; i++) {
                    if (req.user.friends[i].userId.toString() ===  user._id.toString()) {
                        isFriend = true;
                        break;
                    }
                }

                if (!isFriend) friendsFound.push({fullName: user.fullName, location: user.location, id: user._id});
            }else{
                friendsFound.push({fullName: user.fullName, location: user.location, id: user._id});
            }
        })

        res.status(200).json({friendsFound});
    }).catch(err => console.log(err));
}

exports.test = (req, res, next) => {
    res.status(200).json({message: "SUCCESS"});
}

exports.addFriend = (req, res, next) =>{
    const userToAddAsFriend = req.body.userToAddAsFriend;

    User.findById({'_id': userToAddAsFriend}).then(userToAddAsFriend => {
        req.user.friends.push({userId: userToAddAsFriend, status: 2});

        userToAddAsFriend.friends.push({userId: req.user, status: 1});

        req.user.save();

        return userToAddAsFriend.save();
    }).then(() => {
        const socket =  req.app.get("socket");

        socket.broadcast.emit("receivedFriendship " + userToAddAsFriend, {msg: "'" + req.user.fullName + "' just sent you a friend request!", id: req.user._id})
        socket.broadcast.emit("receivedNotification " + userToAddAsFriend, {userThatSentFriendship: {
                id: req.user._id, name: req.user.fullName, location: req.user.location
            }, type: "friendship"})

        return res.status(200).json({message: "Friend request sent"});
    }).catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    })
}

exports.friendReqStatus = (req, res, next) => {
    const {data} = req.body;
    const {status} = data;
    const {userToBeFriendTo} = data;

    let usertoBeFriend;
    User.findById(userToBeFriendTo).then(userToBeFriend => {
      usertoBeFriend = userToBeFriend;
      const userFriendshipRequested = req.user.friends.findIndex(friend => {
          return friend.userId.toString() === userToBeFriendTo.toString()
      });

      const userFriendshipPending = userToBeFriend.friends.findIndex(friend => {
          return friend.userId.toString() === req.user._id.toString();
      });

      // If friend request is accepted
      if (status){
          req.user.friends[userFriendshipRequested].status = 3;
          userToBeFriend.friends[userFriendshipPending].status = 3;
      }else{
          req.user.friends.splice(userFriendshipRequested, 1);
          userToBeFriend.friends.splice(userFriendshipPending, 1)
      }

      req.user.save();
      userToBeFriend.save()

      return status;
    }).then(friendshipStatus => {
        const socket =  req.app.get("socket");

        // Notificate the user that sent the friend request if online via socket
        if (friendshipStatus){
            socket.broadcast.emit("friendThatRequested " + usertoBeFriend._id, {msg: req.user.fullName + " has accepted your friend request!" });

            return res.status(200).json({friendship: true, msg: "Now you are friend with " + usertoBeFriend.fullName, userId: usertoBeFriend._id})
        }

        socket.broadcast.emit("friendThatRequested " + usertoBeFriend._id, {msg: req.user.fullName + " has refused your friend request!" });
        return res.status(200).json({friendship: false, msg: "You refused a friendship with " + usertoBeFriend.fullName, userId: usertoBeFriend._id});
    })
        .catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    })

}

exports.pendingFriends = (req, res, next) => {
    const pendingFriends = [];

    req.user.friends.map(friend => {
        console.log(friend);
        if (friend.status === 1){
            pendingFriends.push(friend);
        }
    })

    if (pendingFriends.length > 0){
        const socket =  req.app.get("socket");
        socket.emit("pending " + req.user._id, {msg: "You have pending friendship requests"})
    }
}