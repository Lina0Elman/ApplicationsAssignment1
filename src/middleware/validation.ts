import { body, param } from 'express-validator';

export const validateComment = [
    body('postId').isMongoId().withMessage('Invalid post ID'),
    body('content').isString().isLength({ min: 1 }).withMessage('Content is required'),
    body('author').isMongoId().withMessage('Invalid user ID'),
];

export const validateCommentId = [
    param('comment_id').isMongoId().withMessage('Invalid comment ID'),
];
