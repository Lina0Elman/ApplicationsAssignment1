const mongoose = require("mongoose");
const Posts = require("./posts_model"); // needed?

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
}, { timestamps: true });

commentSchema.set('toJSON', {
    transform: (doc, ret) => {
        return {
            id: ret._id,
            postId: ret.postId,
            content: ret.content,
            author: ret.author,
            createdAt: ret.createdAt, // is needed?
            updatedAt: ret.updatedAt, // needed?
        };
    }
});

const commentModel = mongoose.model("Comments", commentSchema);

module.exports = commentModel;
