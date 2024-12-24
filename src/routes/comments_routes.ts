import express, { Request, Response, Router } from 'express';
import * as commentsController from '../controllers/comments_controller';

const router: Router = express.Router();

router.post('/', (req: Request, res: Response) => commentsController.addComment(req, res));
router.get('/', (req: Request, res: Response) => commentsController.getAllComments(req, res));
router.get('/:post_id', (req: Request, res: Response) => commentsController.getCommentsByPostId(req, res));
router.put('/:comment_id', (req: Request, res: Response) => commentsController.updateComment(req, res));
router.delete('/:comment_id', (req: Request, res: Response) => commentsController.deleteComment(req, res));

export default router;