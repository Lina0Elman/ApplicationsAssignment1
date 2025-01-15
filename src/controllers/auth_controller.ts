import {Request, Response} from "express";
import * as usersService from "../services/users_service";
import {handleError} from "../utils/handle_error";
import {RefreshTokenModel} from "../models/refresh_token_model";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { body, validationResult } from 'express-validator';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const tokens = await usersService.loginUser(email, password);
        if (!tokens) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        res.json(tokens);
    } catch (err) {
        handleError(err, res);
    }
};
// TODO - Also cancel the token of the user
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        await usersService.logoutUser(refreshToken);
        res.json({ message: 'User logged out successfully' });
    } catch (err) {
        handleError(err, res);
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email } = req.body;
        const savedUser = await usersService.registerUser(username, password, email);
        res.status(201).json(savedUser);
    } catch (err) {
        handleError(err, res);
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(401).json({ message: 'Refresh token required' });
            return;
        }

        const existingToken = await RefreshTokenModel.findOne({ token: refreshToken }).exec();
        if (!existingToken) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }

        const decoded = jwt.verify(refreshToken, config.auth.refresh_token) as { userId: string };
        const user = await usersService.getUserById(decoded.userId);
        if (!user) {
            res.status(401).json({ message: 'Invalid refresh token' });
            return;
        }

        const newAccessToken = jwt.sign({ userId: user.id }, config.auth.access_token, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};