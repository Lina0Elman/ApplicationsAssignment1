import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user_types';


const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Store hashed passwords
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', userSchema);
