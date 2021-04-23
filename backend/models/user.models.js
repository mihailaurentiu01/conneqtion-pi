const {Schema} = require("mongoose");
const mongoose = require("mongoose");

// TESTING PURPOSES.
// TODO ADD BUSINESS REQUIREMENTS

const userModel = new Schema({
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userModel);