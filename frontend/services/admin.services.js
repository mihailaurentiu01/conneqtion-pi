const axios = require("axios");

exports.getAllUsers = async () => {
    return await axios.get("/v1/admin/users").then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}