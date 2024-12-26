import express from 'express';
import commentsRoutes from './routes/comments_routes';
import postsRoutes from './routes/posts_routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/comments', commentsRoutes);
app.use('/posts', postsRoutes);

export default app;