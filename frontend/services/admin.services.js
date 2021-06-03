const axios = require("axios");

exports.getAllUsers = async () => {
    return await axios.get("/v1/admin/users").then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.getUserPosts = async(userId) => {
    return await axios.get("/v1/admin/userposts?userId="+userId).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.deleteUserComment = async (postId, commentId) => {
    return await axios.post("/v1/admin/deleteComment", {postId, commentId}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.deleteUserPost = async(postId) => {
    return await axios.post("/v1/admin/deletePost", {postId}).then(async (res) => {
        return res;
    }).catch(err => console.log(err))
}

exports.banUser = async (userId, ban) => {
    return await axios.post("/v1/admin/ban", {userId, ban}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

exports.globalMessage = async (message) => {
    return await axios.post("/v1/admin/globalMessage", {message}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}