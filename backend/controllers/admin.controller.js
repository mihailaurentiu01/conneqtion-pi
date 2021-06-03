const User = require("../models/user.model");
const Post = require("../models/post.model");

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find({role: 'User'});

    res.status(200).json({users});
}

exports.getUserPosts = async (req, res, next) => {
    const {userId} = req.query;

    const posts = await Post.find({userId: userId});

    res.status(200).json({posts})
}

exports.deleteComment = async (req, res, next) => {
    const {postId} = req.body;
    const {commentId} = req.body;

    const post = await Post.findById(postId);

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId.toString());

    if (commentIndex >= 0){
        post.comments.splice(commentIndex, 1);
        post.save();
    }else{
        return res.status(200).json({msg: "Unable to delete comment. User might already deleted it"});
    }

    return res.status(200).json({msg: "Comment deleted successfully", index: commentIndex});
}

exports.deletePost = async (req, res, next) => {
    const {postId} = req.body;
    await Post.findOneAndDelete({_id: postId})

    res.status(200).json({msg: "Post deleted successfully"});
}

exports.banUser = async (req, res, next) => {
    const {userId} = req.body;
    const {ban} = req.body;

    User.findById(userId).then(user => {
        user.isBanned = ban;
        user.save();

        if (ban){
            return res.status(200).json({msg: user.fullName + " has been banned!", ban: user.isBanned});
        }else{
            return res.status(200).json({msg: user.fullName + " has been unbanned!", ban: user.isBanned});
        }
    }).catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    })
}

exports.globalMessage = async (req, res, next) => {
    const socket =  req.app.get("socket");

    const {message} = req.body;
    const users = await User.find({role: 'User'});

    users.map(user => {
        if (user.online){
            socket.broadcast.emit("globalMessage " + user._id, {msg: message});
        }else{
            user.notifications.push({notification: {
                    msg: message,
                    user: req.user._id,
                    type: "adminMessage"
                }, type: "adminMessage"});
        }

        user.save();
    });

    res.status(200).json({msg: "Message sent successfully"});
}