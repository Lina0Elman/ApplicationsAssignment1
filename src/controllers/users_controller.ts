import { Request, Response } from 'express';
import * as usersService from '../services/users_service';
import { handleError } from '../utils/handle_error';
import bcrypt from 'bcrypt';
import * as config from '../config/config'

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