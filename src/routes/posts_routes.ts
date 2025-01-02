import express, { Request, Response, Router } from 'express';
import * as postsController from '../controllers/posts_controller';

const router: Router = express.Router();

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Add a new post
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', (req: Request, res: Response) => postsController.addPost(req, res));

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The post ID
 *                   title:
 *                     type: string
 *                     description: The title of the post
 *                   content:
 *                     type: string
 *                     description: The content of the post
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the post was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the post was last updated
 */
router.get('/', (req: Request, res: Response) => postsController.getPosts(req, res));

/**
 * @swagger
 * /posts/{post_id}:
 *   get:
 *     summary: Get a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: The post data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The post ID
 *                 title:
 *                   type: string
 *                   description: The title of the post
 *                 content:
 *                   type: string
 *                   description: The content of the post
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was created
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when the post was last updated
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid post ID
 */
router.get('/:post_id', (req: Request, res: Response) => postsController.getPostById(req, res));

/**
 * @swagger
 * /posts/{post_id}:
 *   put:
 *     summary: Update a post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the post
 *               content:
 *                 type: string
 *                 description: The updated content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post not found
 */
router.put('/:post_id', (req: Request, res: Response) => postsController.updatePost(req, res));

/**
 * @swagger
 * /posts/{post_id}:
 *   patch:
 *     summary: Partially update a post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the post
 *               content:
 *                 type: string
 *                 description: The updated content of the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Post not found
 */
router.patch('/:post_id', (req: Request, res: Response) => postsController.updatePost(req, res));

export default router;