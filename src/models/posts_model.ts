import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content?: string;
    owner: mongoose.Schema.Types.ObjectId;
}

const postSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { strict: true });

postSchema.set('toJSON', {
    transform: (doc: Document, ret: Record<string, any>) => {
        return {
            id: ret._id,
            title: ret.title,
            content: ret.content,
            owner: ret.owner
        };
    }
});

export const PostModel = mongoose.model<IPost>("Posts", postSchema);
