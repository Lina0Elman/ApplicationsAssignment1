import { Response } from 'express';
import {isValidationErrors} from "./utils";


export interface ValidationError {
    field: string;
    message: string;
    value: any;
}

export const handleError = (err: any, res: Response) => {
    if (isValidationErrors(err)) {
        const errors: ValidationError[] = Object.keys(err.errors).map(field => ({
            field,
            message: err.errors[field].message,
            value: err.errors[field].value
        }));
        res.status(400).json({ message: err.message, errors });
    } else {
        res.status(500).json({ message: err.message });
    }
};