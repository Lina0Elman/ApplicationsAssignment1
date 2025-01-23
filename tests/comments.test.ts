import request from 'supertest';
import app from '../src/app';
import mongoose, { ConnectOptions, Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PostModel } from '../src/models/posts_model';
import { CommentModel } from '../src/models/comments_model';

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

describe('Comments API Tests', () => {
    let accessToken: string;
    let userId: string;
    let postId: string;

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

        // Create a sample post to attach comments
        const post = new PostModel({
            title: 'Sample Post',
            content: 'This is a sample post',
            owner: userId,
        });
        const savedPost = await post.save();
        postId = savedPost._id!.toString();
    });

    test('Add a comment to a valid post', async () => {
        const response = await request(app)
            .post('/comments')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                postId: postId,
                content: 'This is a test comment.',
                author: userId,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.content).toBe('This is a test comment.');
    });

    test('Get all comments for a post', async () => {
        const response = await request(app)
            .get(`/comments?postId=${postId}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Get a comment by ID', async () => {
        const comment = await CommentModel.create({
            postId: postId,
            content: 'This is a new comment',
            author: userId,
        });

        const response = await request(app)
            .get(`/comments?commentId=${comment._id}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0].content).toBe('This is a new comment');
    });

    test('Update an existing comment', async () => {
        const comment = await CommentModel.create({
            postId: postId,
            content: 'Old comment',
            author: userId,
        });

        const response = await request(app)
            .put(`/comments/${comment._id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: 'Updated comment' });

        expect(response.status).toBe(200);
        expect(response.body.content).toBe('Updated comment');
    });

    test('Delete a comment', async () => {
        const comment = await CommentModel.create({
            postId: postId,
            content: 'This is a new comment',
            author: userId,
        });

        const response = await request(app)
            .delete(`/comments/${comment._id}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comment deleted successfully');
    });


    test('Delete a non-existent comment', async () => {
        const response = await request(app)
            .delete('/comments/60c72b2f9b1d8b3a4c8e4d2b')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Comment not found');
    });


    test('Delete a comment with invalid authorization', async () => {
        const comment = await CommentModel.create({
            postId: postId,
            content: 'This is yet another comment',
            author: userId,
        });

        const response = await request(app)
            .delete(`/comments/${comment._id}`)
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Invalid token');
    });
});
