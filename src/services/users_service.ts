import { UserModel } from '../models/user_model';
import {IUser, UserData} from 'types/user_types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/refresh_token_model';
import * as config from '../config/config'
import {Document} from "mongoose";

const userToUserData = (user: Document<unknown, {}, IUser> & IUser): UserData => {
    return { ...user.toJSON(), id: user.id.toString() };
};


export const addUser = async (username: string, password: string, email: string): Promise<UserData> => {
    const newUser = new UserModel({username, password, email});
    await newUser.save()
    return userToUserData(newUser);
};

export const getUsers = async (): Promise<UserData[]> => {
    const users = await UserModel.find().exec();
    return users.map(userToUserData);
}

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await  UserModel.findOne({ email }).exec();
};

export const getUserById = async (id: string): Promise<UserData | null> => {
    const user = await UserModel.findById(id).exec();
    return user ? userToUserData(user) : null;
};


export const registerUser = async (username: string, password: string, email: string): Promise<UserData> => {
    const hashedPassword = await bcrypt.hash(password, config.default.auth.salt);
    return await addUser(username, hashedPassword, email);
};

export const loginUser = async (email: string, password: string): Promise<{ accessToken: string, refreshToken: string } | null> => {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }

    const accessToken = jwt.sign({ userId: user.id }, config.default.auth.access_token, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, config.default.auth.refresh_token, { expiresIn: '7d' });

    await new RefreshTokenModel({ userId: user.id, token: refreshToken }).save();

    return { accessToken, refreshToken };
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
    await RefreshTokenModel.findOneAndDelete({ token: refreshToken }).exec();
};