const axios = require("axios");

exports.addPost = async (post) =>{
    return await axios.post("/v1/post/add", {post}).then(async (res) => {
        return res;
    }).catch(err => console.log(err))
}

exports.getAllPost = async () =>{
    return await axios.get("/v1/post/all").then(async (res) => {
        return res;
    }).catch(err => console.log(err))
}

exports.getFriendsPosts = async () => {
    return await axios.get("/v1/post/friendsPosts").then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.updatePost = async (post) => {
    return await axios.post("/v1/post/update", {post}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.deletePost = async (postId) => {
    return await axios.post("/v1/post/delete", {postId}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.likePost = async (postId, userId, index) => {
    return await axios.post("/v1/post/like", {postId, userId, index}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.addComment = async (postId, comment) => {
    return await axios.post("/v1/post/addComment", {postId, comment}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.deleteComment = async (postId, commentId, index) => {
    return await axios.post("/v1/post/deleteComment", {postId, commentId, index}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}