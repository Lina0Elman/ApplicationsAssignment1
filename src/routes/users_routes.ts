import express, { Request, Response, Router } from 'express';
import * as usersController from '../controllers/users_controller';

const router: Router = express.Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID
 *                   username:
 *                     type: string
 *                     description: The username of the user
 *                   email:
 *                     type: string
 *                     description: The email of the user
 */
router.get('/', (req: Request, res: Response) => usersController.getUsers(req, res));



router.get('/:id', (req: Request, res: Response) => usersController.getUserById(req, res));

router.delete('/:id', (req: Request, res: Response) => usersController.deleteUserById(req, res));

router.put('/:id', (req: Request, res: Response) => usersController.updateUserById(req, res));

export default router;