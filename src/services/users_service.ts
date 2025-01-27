import { UserModel } from '../models/user_model';
import {IUser, UserData} from 'types/user_types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/refresh_token_model';
import * as config from '../config/config'
import {Document} from "mongoose";
import { BlacklistedTokenModel } from '../models/Blacklisted_token_model';

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



export const updateUserById = async (id: string, updateData: Partial<UserData>): Promise<UserData | null> => {
    const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return user ? userToUserData(user) : null;
};

export const deleteUserById = async (id: string): Promise<UserData | null> => {
    const user = await UserModel.findByIdAndDelete(id).exec();
    return user ? userToUserData(user) : null;
};

export const registerUser = async (username: string, password: string, email: string): Promise<UserData> => {
    const hashedPassword = await bcrypt.hash(password, config.default.auth.salt);
    return await addUser(username, hashedPassword, email);
};

export const getUserByUsernameOrEmail = async (username: string, email: string) => {
    return await UserModel.findOne({ $or: [{ username }, { email }] }).exec();
};


export const loginUser = async (email: string, password: string): Promise<{ accessToken: string, refreshToken: string, userId: string } | null> => {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }

    const accessToken = jwt.sign({ userId: user.id }, config.default.auth.access_token, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, config.default.auth.refresh_token, { expiresIn: '7d' });

    await new RefreshTokenModel({ userId: user.id, token: refreshToken, accessToken: accessToken }).save();

    return { accessToken, refreshToken, userId: user.id };
};

export const logoutUser = async (refreshToken: string | undefined, userId: string): Promise<boolean> => {
    if (refreshToken) {
        // Find the refresh token document
        const tokenDoc = await findRefreshToken(refreshToken);
        if (tokenDoc && tokenDoc.userId === userId) {
            // Delete the specific refresh token
            await RefreshTokenModel.findOneAndDelete({ token: refreshToken }).exec();
            await BlacklistedTokenModel.create({ token: tokenDoc.accessToken });
            return true;
        } else {
            // Invalid refresh token
            return false;
        }
    } else {
        // No refresh token provided, delete all refresh tokens for the user
        const refreshTokens = await RefreshTokenModel.find({ userId }).exec();
        for (const tokenDoc of refreshTokens) {
            await BlacklistedTokenModel.create({ token: tokenDoc.accessToken });
        }
        await RefreshTokenModel.deleteMany({ userId }).exec();
        return true;
    }
};

export const findRefreshToken = async (token: string) => {
    return await RefreshTokenModel.findOne({ token }).exec();
};

export const updateRefreshTokenAccessToken = async (refreshToken: string, newAccessToken: string): Promise<void> => {
    await RefreshTokenModel.findOneAndUpdate(
        { token: refreshToken },
        { accessToken: newAccessToken }
    ).exec();
};

export const blacklistToken = async (token: string): Promise<void> => {
    await new BlacklistedTokenModel({ token }).save();
};

export const isAccessTokenBlacklisted = async (token: string): Promise<boolean> => {
    const blacklistedToken = await BlacklistedTokenModel.findOne({ token }).exec();
    return !!blacklistedToken;
};