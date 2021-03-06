const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const sio = require("../sockets/socket");

exports.search = (req, res, next) => {
    let query = req.query.query;
    /*console.log(req.cookies);*/

    const regexSearch = new RegExp(query, 'i');

    User.find({fullName: {$regex: regexSearch}, '_id': {$ne: req.user._id}, 'role': 'User'}).then(data => {
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

exports.addFriend = (req, res, next) =>{
    const userToAddAsFriend = req.body.userToAddAsFriend;

    let usertoaddasfriend;

    // confusing name. might consider changing it
    User.findById({'_id': userToAddAsFriend}).then(userToAddAsFriend => {
        usertoaddasfriend= userToAddAsFriend;

        req.user.friends.push({userId: userToAddAsFriend, status: 2});

        userToAddAsFriend.friends.push({userId: req.user, status: 1});

        req.user.save();

        return userToAddAsFriend.save();
    }).then(() => {
        const socket =  req.app.get("socket");

        // CHECK IF THE USER IS ONLINE if not stack the notification
        if (!usertoaddasfriend.online){
            usertoaddasfriend.notifications.push({notification: {
                    userThatSentFriendship: {
                        id:  req.user._id,
                        name: req.user.fullName,
                        location: req.user.location,
                        type: "friendship"
                    },
                    type: "friendship"
                }});
            usertoaddasfriend.save();
        }else{
            sio.getIo().emit("receivedFriendship " + userToAddAsFriend, {msg: "'" + req.user.fullName + "' just sent you a friend request!", id: req.user._id})
            sio.getIo().emit("receivedNotification " + userToAddAsFriend, {userThatSentFriendship: {
                    id: req.user._id, name: req.user.fullName, location: req.user.location,
                    type: "friendship"
                }, type: "friendship"})

/*            socket.broadcast.emit("receivedFriendship " + userToAddAsFriend, {msg: "'" + req.user.fullName + "' just sent you a friend request!", id: req.user._id})
            socket.broadcast.emit("receivedNotification " + userToAddAsFriend, {userThatSentFriendship: {
                    id: req.user._id, name: req.user.fullName, location: req.user.location
                }, type: "friendship"})*/
        }

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
    const {notificationId} = data;

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

      //notification remove
      if (notificationId){
          let notificationIndex = req.user.notifications.findIndex(notification => {
              return notification._id.toString() === notificationId.toString();
          })

          req.user.notifications.splice(notificationIndex, 1);
      }

      req.user.save();
      userToBeFriend.save()

      return status;
    }).then(friendshipStatus => {
        const socket =  req.app.get("socket");

        // Notificate the user that sent the friend request if online via socket

        if (friendshipStatus){
            // notifiy the user that sent the request
            // usertoBeFriend is the user that gets notified whether its request of friendship was accepted or not

            if (usertoBeFriend.online){
                socket.broadcast.emit("friendThatRequested " + usertoBeFriend._id, {msg: req.user.fullName + " has accepted your friend request!",
                });
            }else{
                usertoBeFriend.notifications.push({notification: {
                    msg: req.user.fullName + " has accepted your friend request!",
                    id: req.user._id + "status",
                    type: "friendshipStatus"
                }, type: "friendshipStatus"});

                usertoBeFriend.save();
            }

            return res.status(200).json({friendship: true, msg: "Now you are friend with " + usertoBeFriend.fullName, userId: usertoBeFriend._id})
        }

        if (!usertoBeFriend.online){
            usertoBeFriend.notifications.push({notification: {
                    msg: req.user.fullName + " has refused your friend request!",
                    id: req.user._id + "status",
                    type: "friendshipStatus"
                }, type: "friendshipStatus"});

            usertoBeFriend.save();
        }else{
            socket.broadcast.emit("friendThatRequested " + usertoBeFriend._id, {msg: req.user.fullName + " has refused your friend request!", });
        }

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

exports.statusAccept = (req, res, next) => {
    const {notificationId} = req.body;

    let index = req.user.notifications.findIndex(notification => {
        return notification._id.toString() === notificationId;
    })

    req.user.notifications.splice(index, 1);
    req.user.save();

    return res.status(200).json({msg: "Notification erased"});
}

exports.pendingNotifications = (req, res, next) => {
    return res.status(200).json({notifications: req.user.notifications});
}

exports.getUserInfo = async (req, res, next) => {
    const {userId} = req.query;

    const user = await User.findById(userId);

    await user.populate("posts.post").execPopulate();
    await user.populate("friends.userId").execPopulate();

    let filtered = user.posts.filter(post => post.post !== null);


    filtered = filtered.filter(post => post.post.public)

    user.posts = filtered;

    return res.status(200).json({user});
}

exports.changeEmail = async (req, res, next) => {
    const {userId} = req.body;
    const {newEmail} = req.body;

    const userWithEmailExists = await User.findOne({email: newEmail});

    if (userWithEmailExists){
        return res.status(403).json({msg: "That email is not available"});
    }

    const userFound = await User.findById(userId);
    userFound.email = newEmail;

    await userFound.save();

    return res.status(200).json({msg: "Email changed successfully"});
}

exports.changePassword = async (req, res, next) => {
    const {newPassword} = req.body;

    const encryptedPassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);

    req.user.password = encryptedPassword;
    await req.user.save();

    return res.status(200).json({msg: "Password changed successfully!"});
}

exports.chat = async (req, res, next) => {
    const {userToChatWith} = req.body;
    const {message} = req.body;
    const socket =  req.app.get("socket");

    const index = req.user.chats.findIndex(chat => chat.with.toString() === userToChatWith.toString());
    const usrToChatWith = await User.findById(userToChatWith);

    if (index >= 0){
        req.user.chats[index].history.push({message: message, time: new Date(), name: req.user.fullName})
    }else{
        req.user.chats.push({with: userToChatWith, history: [{message: message, time: new Date(), name: req.user.fullName}]})
    }

    const indexUsrToChatWith = usrToChatWith.chats.findIndex(chat => chat.with.toString() === req.user._id.toString());

    if (indexUsrToChatWith >= 0){
        usrToChatWith.chats[indexUsrToChatWith].replies.push({message: message, time: new Date(), name: req.user.fullName});
    }else{
        usrToChatWith.chats.push({with: req.user._id, replies: [{message: message, time: new Date(), name: req.user.fullName}]})
    }

    req.user.save();

    if (usrToChatWith.online){
        socket.broadcast.emit("startedChat " + userToChatWith, {msg: req.user.fullName + " just sent you a chat message"});
    } else{
        // stack notification
        usrToChatWith.notifications.push({notification: {
            msg: req.user.fullName + " sent you a chat message",
            user: req.user._id,
            type: "chatMessage"
        }, type: "chatMessage"});
    }

    usrToChatWith.save();

    sio.getIo().emit("chatWith " + userToChatWith, {message: message, time: new Date(), name: req.user.fullName, type: 'replies'})

    // your message
    res.status(200).json({data: {message: message, time: new Date(), name: req.user.fullName, type: 'history'}});
}

exports.prevConversation = (req, res, next) => {
    const {userToChatWith} = req.body;

    const index = req.user.chats.findIndex(chat => chat.with.toString() === userToChatWith.toString());

    if  (index >= 0){
        let history = req.user.chats[index].history;
        let replies = req.user.chats[index].replies;

        const chat = history.concat(replies);

        chat.sort((a, b) => {
            return new Date(a.time) - new Date(b.time);
        });

        return res.status(200).json({chat})
    }

    res.status(200).json({chat: []})
}

exports.deleteFriend = async (req, res, next) => {
    const {friendToDelete} = req.body;

    const index = req.user.friends.findIndex(friend => friend.userId.toString() === friendToDelete.toString());

    if (index >= 0){
        req.user.friends.splice(index, 1);
        req.user.save();
    }

    const friend = await User.findById(friendToDelete);

    const friendIndex = friend.friends.findIndex(fr => fr.userId.toString() === req.user._id.toString());

    if (friendIndex >= 0){
        friend.friends.splice(friendIndex, 1);
        friend.save();
    }

    sio.getIo().emit("offlineNow " + friendToDelete, {id: req.user._id})

    res.status(200).json({msg: "Friend deleted successfully", index: index});
}