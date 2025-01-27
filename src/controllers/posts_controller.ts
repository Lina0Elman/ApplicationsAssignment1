import { Request, Response } from 'express';
import * as postsService from '../services/posts_service';
import { handleError } from '../utils/handle_error';
import {CustomRequest} from "types/customRequest";
import {PostData} from "types/post_types";
import {postExists} from "../services/posts_service";

export const addPost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const postData: PostData = {
            title: req.body.title,
            content: req.body.content,
            owner: req.user.id
        };

        const savedPost: PostData = await postsService.addPost(postData);

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

export const updatePost = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const owner = req.user.id;
        const post_id = req.params.post_id;
        const postData: PostData = {
            title: req.body.title,
            content: req.body.content,
            owner
        };

        if (await postsService.postExists(post_id)) {

            if (await postsService.isPostOwnedByUser(post_id, owner)) {

                const updatedPost = await postsService.updatePost(post_id, postData);
                if (!updatedPost) {
                    res.status(404).json({message: 'Post not found'});
                } else {
                    res.json(updatedPost);
                }
            }
        } else { // If someone not the owner or try to update post that doesnt exists
            res.status(403).json({message: 'Forbidden'});
        }
    } catch (err) {
        handleError(err, res);
    }
};


export const deletePostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await postsService.getPostById(req.params.post_id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json({ message: 'Post deleted successfully' });
        }
    } catch (err) {
        handleError(err, res);
    }
};