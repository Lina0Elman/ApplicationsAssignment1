import {CommentModel , IComment } from '../models/comments_model';

interface CommentData {
    postId: string;
    content: string;
    author: string;
}

export const addComment = async (commentData: CommentData): Promise<IComment> => {
    const comment = new CommentModel(commentData);
    return await comment.save();
};

export const getCommentsWithAuthorsByPostId = async (postId: string): Promise<IComment[]> => {
    return await CommentModel.find({ postId })
        .populate('author', 'username email') // Fetch user details for the comment author
        .exec();
};

export const getCommentsByPostId = async (postId: string): Promise<IComment[]> => {
    return await CommentModel.find({ postId }).exec();
};

export const getAllComments = async (): Promise<IComment[]> => {
    return await CommentModel.find().exec();
};

export const updateComment = async (commentId: string, commentData: Partial<CommentData>): Promise<IComment | null> => {
    return await CommentModel.findByIdAndUpdate(commentId, commentData, { new: true }).exec();
};

export const deleteComment = async (commentId: string): Promise<IComment | null> => {
    return await CommentModel.findByIdAndDelete(commentId).exec();
};