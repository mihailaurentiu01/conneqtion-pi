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
    const {userId} = req.body;
    const {index} = req.body;
    const socket =  req.app.get("socket");

    let alreadyLiked = false;

    Post.findById(postId).then(post => {
        if (post.likes.length  > 0){
            post.likes.map(like => {
                if (like.user.toString() !== userId.toString()){
                    post.likes.push({user: userId});
                } else{
                    alreadyLiked = true;

                    if (alreadyLiked){
                        const index = post.likes.findIndex(like => like.user.toString() === userId.toString());
                        post.likes.splice(index, 1);
                    }
                }
            });
        }else{
            post.likes.push({user: userId})
        }

        post.save();

        // Notify the author the decision
        post.populate("userId").execPopulate().then(newPost => {
            if (newPost.userId.online){
                socket.broadcast.emit("likedPost " + post.userId._id,
                    {msg: req.user.fullName + " liked your post: '" + post.title + "'", alreadyLiked: alreadyLiked, index: index, user: req.user._id});
            }else{
                // Stack a notification
                // Notify just if liked
                if (!alreadyLiked){
                    newPost.userId.notifications.push({
                        notification: {
                            msg: req.user.fullName + " liked your post: '" + post.title + "'",
                            user: req.user._id,
                            type: "postLikeStatus"
                        },
                        type: "postLikeStatus"
                    });

                    newPost.userId.save();
                }
            }
        }).catch(err => {
            console.log(err);
            if (!err.httpStatusCode){
                err.httpStatusCode = 500;
                err.message = "Server-Side error. Try again later";
            }

            next(err);
        });

        res.status(200).json({alreadyLiked: alreadyLiked, index: index});
    }).catch(err => console.log(err))
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
        }).catch(err => console.log(err));

        await Post.findOneAndDelete({'_id': postId});

        return res.status(200).json({posts: posts, user: req.user.fullName, msg: "Post deleted successfully!", index: index});
    }).catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    });
}

exports.addComment = (req, res, next) => {
    const {postId} = req.body;
    const {comment} = req.body;
    const socket =  req.app.get("socket");

    let usrComment = {user: req.user._id, comment: comment, date: new Date()};

    Post.findById(postId).then(post => {
        post.comments.push({userId: usrComment.user, comment: usrComment.comment, date: usrComment.date, username: req.user.fullName});
        return post.save();
    }).then(savedPost => {
        const comId = savedPost.comments[savedPost.comments.length-1]._id;

        savedPost.populate("userId").execPopulate().then(post => {
            usrComment._id = comId;
            usrComment.username = req.user.fullName;

            // If it's online, notify else stack
            if (post.userId.online){
                socket.broadcast.emit("commentedPost " + post.userId._id,
                    {msg: req.user.fullName + " commented on your post: '" + post.title + "'", postId: postId, user: req.user._id, comment: usrComment});
            }else{
                post.userId.notifications.push({
                    notification: {
                        msg: req.user.fullName + " commented on your post: '" + post.title + "'",
                        user: req.user._id,
                        type: "postMessageStatus"
                    },
                    type: "postMessageStatus"
                });

                post.userId.save();
            }
        });
        return res.status(200).json({comment: {
                comment: usrComment.comment,
                date: usrComment.date,
                postId: postId,
                userId: req.user._id,
                username: req.user.fullName,
                _id: comId
            }});
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

exports.deleteComment = (req, res, next) => {
    const {postId} = req.body;
    const {commentId} = req.body;
    const {index} = req.body;

    const socket =  req.app.get("socket");

    Post.findById(postId).then(post => {
        const commentIndex = post.comments.findIndex(comment => {
            return comment._id.toString() === commentId.toString();
        })

        post.comments.splice(commentIndex, 1);
        post.save();

        post.populate("userId").execPopulate().then(newPost => {
            socket.broadcast.emit("postCommentDeleted " + newPost.userId._id, {postId: postId, index: commentIndex})
        });

        res.status(200).json({msg: "Comment deleted successfully!", index: index});
    }).catch(err => {
        console.log(err);
        if (!err.httpStatusCode){
            err.httpStatusCode = 500;
            err.message = "Server-Side error. Try again later";
        }

        next(err);
    })
}