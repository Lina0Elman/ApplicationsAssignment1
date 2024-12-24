import app from './src/app';
import * as dotenv from 'dotenv';
import {connectToDatabase} from './src/db';
import config from './src/config/config';

// Initialize environment variables
dotenv.config();

const startServer = async () : Promise<void> => {
    await connectToDatabase(config.db.uri);

    app.listen(config.app.port, () => {
        console.log(`Server running on http://localhost:${config.app.port}${config.app.baseName}`);
    });
};

startServer();