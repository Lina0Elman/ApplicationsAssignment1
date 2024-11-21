const Comment = require('../models/comments_model');

exports.addComment = async (commentData) => {
    const comment = new Comment(commentData);
    return await comment.save();
};

exports.getCommentsByPostId = async (postId) => {
    return await Comment.find({ postId }).exec();
};

exports.getAllComments = async () => {
    return await Comment.find().exec();
};

exports.updateComment = async (commentId, commentData) => {
    return await Comment.findByIdAndUpdate(commentId, commentData, { new: true }).exec();
};

exports.deleteComment = async (commentId) => {
    return await Comment.findByIdAndDelete(commentId).exec();
};
