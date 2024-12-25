import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    postId: mongoose.Schema.Types.ObjectId;
    content: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const commentSchema: Schema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    // TODO - Connect to a user model
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
}, { timestamps: true });

commentSchema.set('toJSON', {
    transform: (doc: Document, ret: Record<string, any>) => {
        return {
            id: ret._id,
            postId: ret.postId,
            content: ret.content,
            author: ret.author,
            createdAt: ret.createdAt,
            updatedAt: ret.updatedAt,
        };
    }
});

export const CommentModel = mongoose.model<IComment>("Comments", commentSchema);

