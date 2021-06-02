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
    chats: [
        {
            with: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            history: [
                {
                    name: {
                      type: String
                    },
                    time: {
                        type: Date,
                    },
                    message: {
                        type: String,
                    },
                    type: {
                        type: String,
                        default: "history"
                    }
                }
            ],
            replies: [
                {
                    name: {
                      type: String
                    },
                    time: {
                        type: Date,
                    },
                    message: {
                        type: String,
                    },
                    type: {
                        type: String,
                        default: "replies"
                    }
                }
            ]
        }
    ],
    posts: [
        {post: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Post'
        }}
    ],
    role: {
        type: String,
        default: "User"
    },
    isBanned: {
        type: Boolean,
        default: false
    }
},  { timestamps: true });

module.exports = mongoose.model("User", userModel);