import express, { Request, Response, Router } from 'express';
import * as usersController from '../controllers/users_controller';

const router: Router = express.Router();

router.post('/', (req: Request, res: Response) => usersController.addUser(req, res));
router.get('/', (req: Request, res: Response) => usersController.getUsers(req, res));

export default router;