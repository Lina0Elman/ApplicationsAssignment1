import { get } from 'http';
import {UserModel } from '../models/user_model';
import { IUser, UserData } from '../types/user_types';

export const addUser = async (userData: UserData): Promise<IUser> => {
    const newUser = new UserModel(userData);
    return await newUser.save();
};

export const getUsers = async (): Promise<IUser[]> => {
    return UserModel.find().exec();
}

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await UserModel.findOne({ email }).exec();
};

export const getUserById = async (id: string): Promise<IUser | null> => {
    return await UserModel.findById({ id }).exec();
};