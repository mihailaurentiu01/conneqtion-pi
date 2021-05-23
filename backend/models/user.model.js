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
        },
        status: {
            type: Number,
            enums: [
                1, // Requested
                2, // Pending
                3 // Friends
            ]
        }
    }],
    online: {
        type: Boolean,
        default: false,
        required: true,
    },
    notifications: [{
        notification: {
            type: Object
        },
        type:{
            type: String
        }
    }],
    posts: [
        {post: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Post'
        }}
    ]
},  { timestamps: true });

module.exports = mongoose.model("User", userModel);