const {Schema} = require("mongoose");
const mongoose = require("mongoose");

const pagination = require("mongoose-aggregate-paginate-v2");

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
    comments: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            comment: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        }
    ],
    public: {
        type: Boolean,
        required: true
    }
},   { timestamps: true });

postModel.plugin(pagination);
module.exports = mongoose.model("Post", postModel);