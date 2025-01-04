import mongoose, {Document} from "mongoose";

export interface IComment extends Document {
    postId: mongoose.Schema.Types.ObjectId;
    content: string;
    author: string;
    createdAt?: Date;
    updatedAt?: Date;
}