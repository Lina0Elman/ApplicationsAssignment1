import {PostModel } from '../models/posts_model';
import { IPost, PostData } from '../types/post_types';

export const addPost = async (postData: PostData): Promise<IPost> => {
    const newPost = new PostModel(postData);
    return await newPost.save();
};

export const getPosts = async (owner?: string): Promise<IPost[]> => {
    if (owner) {
        return PostModel.find({ owner }).exec();
    } else {
        return PostModel.find().exec();
    }
};

export const getPostById = async (postId: string): Promise<IPost | null> => {
    return PostModel.findById(postId).exec();
};

export const updatePost = async (postId: string, postData: Partial<PostData>): Promise<IPost | null> => {
    return PostModel.findByIdAndUpdate(postId, { ...postData }, { new: true, runValidators: true }).exec();
};