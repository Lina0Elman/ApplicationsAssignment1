import {UserModel } from '../models/user_model';
import { IUser } from './user_types';
import { UserData } from 'types/user_data';



export const addUser = async (userData: UserData): Promise<IUser> => {
    const newUser = new UserModel(userData);
    return await newUser.save();
};

export const getUsers = async (): Promise<IUser[]> => {
    return UserModel.find().exec();
}
