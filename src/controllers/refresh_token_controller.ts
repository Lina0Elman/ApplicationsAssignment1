import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/refresh_token_model';
import { Request, Response } from 'express';
import * as usersService from '../services/users_service';
import config from '../config/config';

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

        const newAccessToken = jwt.sign({ userId: user._id }, config.auth.access_token, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};
