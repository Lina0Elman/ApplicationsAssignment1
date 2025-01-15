import request from 'supertest';
import app from '../src/app';
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../src/models/user_model';

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

describe('Users API Tests', () => {
    test('Register a new user', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    test('Login a user', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });

    test('Fail to login with invalid credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'invalid@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });

    test('Get user details', async () => {
        const registerResponse = await request(app)
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

        const response = await request(app)
            .get(`/users/${registerResponse.body.id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.username).toBe('TestUser');
    });

    test('Update user details', async () => {
        const registerResponse = await request(app)
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

        const response = await request(app)
            .put(`/users/${registerResponse.body.id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
            .send({
                username: 'UpdatedUser',
                email: 'updateduser@example.com',
            });

        expect(response.status).toBe(200);
        expect(response.body.username).toBe('UpdatedUser');
    });

    test('Delete user', async () => {
        const registerResponse = await request(app)
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

        const response = await request(app)
            .delete(`/users/${registerResponse.body.id}`)
            .set('Authorization', `Bearer ${loginResponse.body.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });
});
