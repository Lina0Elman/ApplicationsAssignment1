import mongoose, { Schema } from 'mongoose';
import { IUser , UserData} from 'types/user_types';


const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Store hashed passwords
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret): UserData => {
    return {
      id: ret._id,
      username: ret.username,
      email: ret.email,
      createdAt: ret.createdAt,
      updatedAt: ret.updatedAt
    };
  }
});

export const UserModel = mongoose.model<IUser>('User', userSchema);