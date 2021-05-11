const axios = require("axios");

exports.search = async (query) => {
  return await axios.get("/v1/user/search?query=" + query).then(async (res) => {
     return res.data;
  }).catch(err => console.log(err));
}

exports.addFriend = async(userId) => {
    return await axios.post("v1/user/addFriend", {userToAddAsFriend: userId}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}