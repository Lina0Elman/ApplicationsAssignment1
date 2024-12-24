const app = require('./src/app');
const dotenv = require('dotenv');
const connectToDatabase = require('./src/db');
const config = require('./src/config/config');


// Initialize environment variables
dotenv.config();

const startServer = async () => {
    await connectToDatabase(config.db.uri);

    app.listen(config.app.port, () => {
        console.log(`Server running on http://localhost:${config.app.port}${config.app.baseName}`);
    });
};

startServer();