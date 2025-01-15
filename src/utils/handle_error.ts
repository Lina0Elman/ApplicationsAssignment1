import { Response } from 'express';
import {isMongoValidationErrors, isReqValidationErrors} from "./utils";
import {ValidationError} from "types/validation_errors";



export const handleError = (err: any, res: Response) => {
    if (isMongoValidationErrors(err)) {
        const errors: ValidationError[] = Object.keys(err.errors).map(field => ({
            field,
            message: err.errors[field].message,
            value: err.errors[field].value
        }));
        res.status(400).json({ message: err.message, errors });
    } else if (isReqValidationErrors(err)) {
        const errors: ValidationError[] = err.errors.map((error: any) => ({
            field: error.parm ?? error.path ,
            message: error.msg,
            value: error.value
        }));
        res.status(400).json({ message: err.message, errors });
    } else {
        res.status(500).json({ message: err.message });
    }
};