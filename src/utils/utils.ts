import mongoose, {Error} from "mongoose";
import {ValidationError} from "express-validator";


export const isMongoValidationErrors = (err: any) => {
    return err instanceof mongoose.Error.ValidationError;
}

export const isReqValidationErrors = (err: any): err is {
    message: any; errors: ValidationError[]
} => {
    return Array.isArray(err.errors) && err.errors.every((error: any) => {
        return typeof (error.param === 'string' || error.path === 'string') && typeof error.msg === 'string';
    });
};