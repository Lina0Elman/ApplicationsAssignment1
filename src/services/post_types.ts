import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content?: string;
    owner: mongoose.Schema.Types.ObjectId;
}