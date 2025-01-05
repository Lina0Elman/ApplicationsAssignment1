import { Request, Response } from 'express';
import * as usersService from '../services/users_service';
import { handleError } from '../utils/handle_error';
import bcrypt from 'bcrypt';
import * as config from '../config/config'
import jwt from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/refresh_token_model';

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, config.default.auth.salt); // Hash the password
        const userData = {username, password: hashedPassword, email};
        const savedPost = await usersService.addUser(userData);
        res.status(201).json(`Added user ${username} with id: ${savedPost._id}`);
    } catch (err) {
        handleError(err, res);
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        let users;
        users = await usersService.getUsers();
        if (users.length === 0) {
            res.status(204).json({ message: 'No users found' });
        } else {
            res.json(users);
        }
    } catch (err) {
        handleError(err, res);
    }
};



export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, config.default.auth.salt); // Hash the password
        const userData = { username, password: hashedPassword, email };
        const savedUser = await usersService.addUser(userData);
        res.status(201).json(`Registered user ${username} with id: ${savedUser._id}`);
    } catch (err) {
        handleError(err, res);
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await usersService.getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = jwt.sign({ userId: user._id }, config.default.auth.access_token, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, config.default.auth.refresh_token, { expiresIn: '7d' });

        // Save refresh token in the database
        await new RefreshTokenModel({ userId: user._id, token: refreshToken }).save();

        res.json({ accessToken, refreshToken });
    } catch (err) {
        handleError(err, res);
    }
};


export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await RefreshTokenModel.findOneAndDelete({ token: refreshToken }).exec();
        }
        res.json({ message: 'User logged out successfully' });
    } catch (err) {
        handleError(err, res);
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await usersService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (err) {
        handleError(err, res);
    }
}