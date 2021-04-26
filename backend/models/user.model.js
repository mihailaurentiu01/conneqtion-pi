const {Schema} = require("mongoose");
const mongoose = require("mongoose");

// TODO ADD BUSINESS REQUIREMENTS

const userModel = new Schema({
    username: {
        type:String,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userModel);