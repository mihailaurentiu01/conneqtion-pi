let {validationResult} = require("express-validator");
const Post = require("../models/post.model");
const User = require("../models/user.model");

exports.add = (req, res, next) => {
    let errors = validationResult(req);
    const errorsBack = [];

    if (!errors.isEmpty()){
        errors.errors.map(error => errorsBack.push(error.msg));

        console.log(errorsBack)
        return res.status(401).json({errors: errorsBack});
    }

    const {post} = req.body;
    post.userId = req.user._id;

    const newPost = new Post(post);

    let savedpost;
    newPost.save().then(savedPost => {
        savedpost = savedPost;
        req.user.posts.push({post: savedPost._id});
        req.user.save();

        return res.status(200).json({msg: "Post has been created successfully"});
    }).then(() => {
        const socket =  req.app.get("socket");

        req.user.populate("friends.userId").execPopulate().then(user => {
            user.friends.map(friend => {
                const postData = {
                    friend: '',
                    posts: []
                };

                postData.friend = req.user.fullName;
                postData.posts.push(newPost);

                socket.broadcast.emit("friendAddedNewPost " + friend.userId._id, {post: postData});
            })
          /*  friends.map(friend => {
                socket.broadcast.emit("friendAddedNewPost " + friend._id, {msg: "yep"});
                //{notificationId: notification._id, msg: notification.notification.msg, userId: notification.notification.id, type: notification.notification.type}
            })*/
        })

    }).catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    });
}

exports.getAll = (req, res, next) => {
    req.user.populate('posts.post').execPopulate().then(data => {
        const posts = [];

        data.posts.map(post => {
            posts.push(post.post);
        });


        return res.status(200).json({posts: posts, user: req.user.fullName});
    }).catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    });
}

exports.getFriendsPosts = async (req, res, next) => {
    let postsData = await Promise.all(req.user.friends.map(checkFriendPosts));
    res.status(200).json({postsData: postsData});
}

async function checkFriendPosts(friend){
    if (friend.status === 3) {
        const friendFound = await User.findById(friend.userId).select('fullName posts');
        const friendPosts = await friendFound.populate("posts.post").execPopulate();

/*        if (friendPosts.posts.length < 1){
            return;
        }*/

        const postsData = {
            friend: '',
            posts: []
        };

        postsData.friend = friendFound.fullName;


        // Map and add posts
        friendPosts.posts.map(post => {
            postsData.posts.push(post.post);
        });

        return postsData;
    }
}

exports.postLike = (req, res, next) => {
    const {postId} = req.body;
}

exports.update = (req, res, next) => {
    const {post} = req.body;

    let postfound;
    Post.findById(post._id).then(postFound => {

        postFound.title = post.title;
        postFound.description = post.description;
        postFound.public = post.public;
        postFound.save();

        postfound = postFound;
        return res.status(200).json({msg: "Post updated successfully", post: postFound})
    }).then(() => {
        const socket =  req.app.get("socket");

        req.user.populate("friends.userId").execPopulate().then(user => {
            user.friends.map(friend => {
                socket.broadcast.emit("friendUpdatedPost " + friend.userId._id, {post: postfound, friend: req.user.fullName});
            })
        })
    }).catch(err => {
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    })
}

exports.delete = (req, res, next) => {
    const {postId} = req.body;
    const socket =  req.app.get("socket");

    req.user.populate('posts.post').execPopulate().then(async (data) => {
        const posts = [];

        data.posts.map(post => {
            posts.push(post.post);
        });

          const index = req.user.posts.findIndex(post => {
                return post.post._id.toString() === postId.toString();
        });


        req.user.posts.splice(index, 1);
        posts.splice(index, 1);

        req.user.save();

        req.user.populate("friends.userId").execPopulate().then(user => {
            user.friends.map(async (friend) => {
                socket.broadcast.emit("friendDeletedPost " + friend.userId._id, {index: index, friend: req.user.fullName});
            })
        })

        await Post.findOneAndDelete({'_id': postId});

        return res.status(200).json({posts: posts, user: req.user.fullName, msg: "Post deleted successfully!", index: index});
    });
}