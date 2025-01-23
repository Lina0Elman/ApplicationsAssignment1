import request from 'supertest';
import app from '../src/app';
import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';


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


describe('Users API Tests', () => {

    let userId: string;
    let accessToken: string;

    beforeEach(async () => {
        // Clean the database before each test
        await mongoose.connection.db?.dropDatabase();
    });

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
        userId = response.body.id;
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
        accessToken = response.body.accessToken;
    });

    test('Get a user without authorization', async () => {
        const response = await request(app)
            .get(`/users/${userId}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access token required');
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

describe('Create User API Tests', () => {
    let accessToken: string;

    beforeAll(async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: 'TestAdmin',
                email: 'testadmin@example.com',
                password: 'adminpassword123',
            });

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'testadmin@example.com',
                password: 'adminpassword123',
            });

        accessToken = loginResponse.body.accessToken;
    });

    test('Create a new user successfully', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                username: 'NewUser',
                email: 'newuser@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('NewUser');
        expect(response.body.email).toBe('newuser@example.com');
    });

    test('Fail to create a user with missing fields', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                username: 'IncompleteUser',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
    });

    test('Update a non-existent user', async () => {
        const response = await request(app)
            .put('/users/60c72b2f9b1d8b3a4c8e4d2b')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ username: 'nonexistentuser' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    
    test('Fail to create a user with invalid email', async () => {
        const response = await request(app)
            .post('/users')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                username: 'InvalidEmailUser',
                email: 'invalid-email',
                password: 'password123',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
    });
});
