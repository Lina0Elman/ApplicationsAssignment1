import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    userId: string;
    token: string;
    createdAt: Date;
}

const RefreshTokenSchema: Schema = new Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }, // Token expires in 7 days
});

export const RefreshTokenModel = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);