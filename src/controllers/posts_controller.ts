import { Request, Response } from 'express';
import * as postsService from '../services/posts_service';
import { handleError } from '../utils/handle_error';

export const addPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const savedPost = await postsService.addPost(req.body);
        res.status(201).json(savedPost);
    } catch (err) {
        handleError(err, res);
    }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        let posts;
        if (req.query.sender) {
            posts = await postsService.getPosts(req.query.sender as string);
        } else {
            posts = await postsService.getPosts();
        }

        if (posts.length === 0) {
            res.status(204).json({ message: 'No posts found' });
        } else {
            res.json(posts);
        }
    } catch (err) {
        handleError(err, res);
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await postsService.getPostById(req.params.post_id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json(post);
        }
    } catch (err) {
        handleError(err, res);
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postData = { title: req.body.title, content: req.body.content };
        const updatedPost = await postsService.updatePost(req.params.post_id, postData);
        if (!updatedPost) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json(updatedPost);
        }
    } catch (err) {
        handleError(err, res);
    }
};