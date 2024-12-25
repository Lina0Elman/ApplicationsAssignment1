import express, { Request, Response, Router } from 'express';
import * as commentsController from '../controllers/comments_controller';
import { validateComment, validateCommentId } from '../middleware/validation';


const router: Router = express.Router();

router.post('/', validateComment, (req: Request, res: Response) => commentsController.addComment(req, res));
router.get('/', (req: Request, res: Response) => commentsController.getAllComments(req, res));

/**
 * @swagger
 * /comments/{post_id}:
 *   get:
 *     summary: Get comments by post ID
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
 */
router.get('/:post_id', (req: Request, res: Response) => commentsController.getCommentsByPostId(req, res));
router.put('/:comment_id', validateCommentId, (req: Request, res: Response) => commentsController.updateComment(req, res));
router.delete('/:comment_id', validateCommentId, (req: Request, res: Response) => commentsController.deleteComment(req, res));

export default router;