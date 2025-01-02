import {UserModel, IUser } from '../models/user_model';

interface UserData {
    username: string;
    email: string;
    password: string;
}

export const addUser = async (userData: UserData): Promise<IUser> => {
    const newUser = new UserModel(userData);
    return await newUser.save();
};

export const getUsers = async (): Promise<IUser[]> => {
    return UserModel.find().exec();
}
