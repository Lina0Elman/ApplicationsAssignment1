const {isValidationErrors} = require ("../services/posts_service");

exports.handleError = (err, res) => {
    if (isValidationErrors(err)) {
        const errors = Object.keys(err.errors).map(field => ({
            field,
            message: err.errors[field].message,
            value: err.errors[field].value
        }));
        res.status(400).json({ message: err.message, errors });
    } else {
        res.status(500).json({ message: err.message });
    }
};