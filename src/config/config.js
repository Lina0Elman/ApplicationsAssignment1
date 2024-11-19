module.exports = {
    app: {
        port: process.env.PORT || 3000,
        baseName: process.env.BASE_NAME || ''
    },
    db: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017'
    }
};