import mongoose from "mongoose";

export const isValidationErrors = (err: any) => {
    return err instanceof mongoose.Error.ValidationError;
}