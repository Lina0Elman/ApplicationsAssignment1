import express, { Request, Response, Router } from 'express';
import * as postsController from '../controllers/posts_controller';

const router: Router = express.Router();

router.post('/', (req: Request, res: Response) => postsController.addPost(req, res));
router.get('/', (req: Request, res: Response) => postsController.getPosts(req, res));
router.get('/:post_id', (req: Request, res: Response) => postsController.getPostById(req, res));
router.put('/:post_id', (req: Request, res: Response) => postsController.updatePost(req, res));
router.patch('/:post_id', (req: Request, res: Response) => postsController.updatePost(req, res));

export default router;