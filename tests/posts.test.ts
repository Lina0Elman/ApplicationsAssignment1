import request from 'supertest';
import app from '../src/app';
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PostModel } from '../src/models/posts_model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Clean the database before each test
    await mongoose.connection.db?.dropDatabase();
});

describe('Posts API Tests', () => {
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
        // Register and log in to get the access token
        await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        accessToken = loginResponse.body.accessToken;
        userId = loginResponse.body.userId;
    });

    test('Create a new post', async () => {
        const response = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'New Post',
                content: 'This is a new post',
                author: userId,
            });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe('New Post');
        expect(response.body.content).toBe('This is a new post');
        expect(response.body.owner).toBe(userId);
    });

    test('Get all posts', async () => {
        await PostModel.create({
            title: 'New Post',
            content: 'This is a new post',
            owner: userId,
        });

        const response = await request(app)
            .get('/posts')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('New Post');
    });

    test('Get a post by ID', async () => {
        const post = await PostModel.create({
            title: 'New Post',
            content: 'This is a new post',
            owner: userId,
        });

        const response = await request(app)
            .get(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('New Post');
        expect(response.body.content).toBe('This is a new post');
    });

    test('Update a post', async () => {
        const post = await PostModel.create({
            title: 'New Post',
            content: 'This is a new post',
            owner: userId,
        });

        const response = await request(app)
            .put(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'Updated Post',
                content: 'This is an updated post',
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Updated Post');
        expect(response.body.content).toBe('This is an updated post');
    });

    test('Delete a post', async () => {
        const post = await PostModel.create({
            title: 'New Post',
            content: 'This is a new post',
            owner: userId,
        });

        const response = await request(app)
            .delete(`/posts/${post._id}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Post deleted successfully');
    });
});