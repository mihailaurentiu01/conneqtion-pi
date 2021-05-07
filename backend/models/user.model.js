const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const userModel = new Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    friends: [
        {userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    online: {
        type: Boolean,
        default: false,
        required: true,
    }
});

module.exports = mongoose.model("User", userModel);