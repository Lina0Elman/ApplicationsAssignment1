import request from 'supertest';
import app from '../src/app';
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as usersService from '../src/services/users_service';

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

describe('Auth API Tests', () => {
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
        expect(response.body).toHaveProperty('username', 'TestUser');
        expect(response.body).toHaveProperty('email', 'testuser@example.com');
        expect(response.body).toHaveProperty('createdAt');
        expect(response.body).toHaveProperty('updatedAt');
    });

    test('Register with missing fields', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Register with invalid email format', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'invalid-email',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Register with a short password', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'short',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Register with an already registered email', async () => {
        const responseFirst = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'AnotherUser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(responseFirst.status).toBe(201);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Login with valid credentials', async () => {
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
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('accessToken');
    });

    test('Login with missing fields', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Login with unregistered email', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'unregistered@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    test('Login with invalid credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    test('Register with an already registered username', async () => {
        const responseFirst = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser1@example.com',
                password: 'password123',
            });

        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser2@example.com',
                password: 'password123',
            });

        expect(responseFirst.status).toBe(201);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Login with incorrect password', async () => {
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
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    test('Login with missing email', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Login with missing password', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Register with an empty username', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: '',
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Register with an empty email', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: '',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Register with an empty password', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: '',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Logout user and cancel the token', async () => {
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

        const { refreshToken, accessToken } = loginResponse.body;

        const logoutResponse = await request(app)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ refreshToken });

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.body).toHaveProperty('message', 'User logged out successfully');

        const tokenCheckResponse = await usersService.findRefreshToken(refreshToken);

        expect(tokenCheckResponse).toBeNull();
    });

    test('Access protected route without token', async () => {
        const response = await request(app)
            .get('/protected-route');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access token required');
    });

    test('Access protected route with invalid token', async () => {
        const response = await request(app)
            .get('/protected-route')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Invalid token');
    });

    test('Attempt to perform action with blacklisted access token', async () => {
        // Register a new user
        const registerResponse = await request(app)
            .post('/auth/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        // Log in the user to get the access token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123',
            });

        const { refreshToken, accessToken } = loginResponse.body;

        // Log out the user to blacklist the access token
        await request(app)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ refreshToken });

        // Attempt to perform an action with the blacklisted access token
        const actionResponse = await request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${accessToken}`)

        // Expect a 403 status code
        expect(actionResponse.status).toBe(403);
        expect(actionResponse.body).toHaveProperty('message', 'Token is blacklisted');
    });
});