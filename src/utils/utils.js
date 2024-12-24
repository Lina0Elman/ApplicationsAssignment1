const mongoose = require('mongoose');

exports.isValidationErrors = (err) => {
    return err instanceof mongoose.Error.ValidationError;
}