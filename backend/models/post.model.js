const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const postModel = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }
    }],
    comments: {
        type: Array
    },
    public: {
        type: Boolean,
        required: true
    }
},   { timestamps: true });

module.exports = mongoose.model("Post", postModel);