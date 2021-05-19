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
    likesAmount: {
        type: Number,
        required: true
    },
    comments: {
        type: Array
    },
    public: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Post", postModel);