export default {
    app: {
        port: process.env.PORT || 3000,
        baseName: process.env.BASE_NAME || ''
    },
    db: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017'
    },
    auth: {
        access_token: process.env.ACCESS_TOKEN_SECRET || 'lala'
    }
};