import express, { Request, Response, Router } from 'express';
import * as commentsController from '../controllers/comments_controller';
import { validateComment, validateCommentId } from '../middleware/validation';

const router: Router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a new comment
 *     tags:
 *       - Comments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: string
 *                 description: The ID of the post to add the comment to
 *               text:
 *                 type: string
 *                 description: The comment content
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateComment, (req: Request, res: Response) => commentsController.addComment(req, res));

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: List of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The comment ID
 *                   post_id:
 *                     type: string
 *                     description: The associated post ID
 *                   text:
 *                     type: string
 *                     description: The comment content
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the comment was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the comment was last updated
 */
router.get('/', (req: Request, res: Response) => commentsController.getAllComments(req, res));

/**
 * @swagger
 * /comments/{post_id}:
 *   get:
 *     summary: Get comments by post ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The comment ID
 *                   post_id:
 *                     type: string
 *                     description: The associated post ID
 *                   text:
 *                     type: string
 *                     description: The comment content
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the comment was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the comment was last updated
 *       404:
 *         description: No comments found for the given post ID
 *       400:
 *         description: Invalid post ID
 */
router.get('/:post_id', (req: Request, res: Response) => commentsController.getCommentsByPostId(req, res));

/**
 * @swagger
 * /comments/{comment_id}:
 *   put:
 *     summary: Update a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated comment content
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Comment not found
 */
router.put('/:comment_id', validateCommentId, (req: Request, res: Response) => commentsController.updateComment(req, res));

/**
 * @swagger
 * /comments/{comment_id}:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 */
router.delete('/:comment_id', validateCommentId, (req: Request, res: Response) => commentsController.deleteComment(req, res));

export default router;
