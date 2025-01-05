import express, { Request, Response, Router } from 'express';
import * as usersController from '../controllers/users_controller';

const router: Router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', (req: Request, res: Response) => usersController.addUser(req, res));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
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
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the user was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the user was last updated
 */
router.get('/', (req: Request, res: Response) => usersController.getUsers(req, res));

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', (req: Request, res: Response) => usersController.registerUser(req, res));

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req: Request, res: Response) => usersController.loginUser(req, res));

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', (req: Request, res: Response) => usersController.logoutUser(req, res));

export default router;