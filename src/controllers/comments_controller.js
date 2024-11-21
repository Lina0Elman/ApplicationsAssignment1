const commentsService = require('../services/comments_service');
const { handleError } = require("../utils/handle_error");

exports.addComment = async (req, res) => {
    try {
        const savedComment = await commentsService.addComment(req.body);
        res.status(201).json(savedComment);
    } catch (err) {
        handleError(err, res);
    }
};

exports.getCommentsByPostId = async (req, res) => {
    try {
        const comments = await commentsService.getCommentsByPostId(req.params.post_id);
        if (comments.length === 0) {
            res.status(204).json({ message: 'No comments found for this post' });
        } else {
            res.json(comments);
        }
    } catch (err) {
        handleError(err, res);
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const comments = await commentsService.getAllComments();
        res.json(comments);
    } catch (err) {
        handleError(err, res);
    }
};

exports.updateComment = async (req, res) => {
    try {
        const updatedComment = await commentsService.updateComment(req.params.comment_id, req.body);
        if (!updatedComment) {
            res.status(404).json({ message: 'Comment not found' });
        } else {
            res.json(updatedComment);
        }
    } catch (err) {
        handleError(err, res);
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const deletedComment = await commentsService.deleteComment(req.params.comment_id);
        if (!deletedComment) {
            res.status(404).json({ message: 'Comment not found' });
        } else {
            res.json({ message: 'Comment deleted successfully' });
        }
    } catch (err) {
        handleError(err, res);
    }
};
