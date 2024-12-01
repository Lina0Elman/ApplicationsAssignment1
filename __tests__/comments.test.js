const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Comments = require('../src/models/comments_model');
const Posts = require('../src/models/posts_model');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Clean the database before each test
    await mongoose.connection.db.dropDatabase();
});

describe('Comments API Tests', () => {
    let postId;

    beforeEach(async () => {
        // Create a sample post to attach comments
        const post = new Posts({
            title: 'Sample Post',
            content: 'This is a sample post',
            owner: new mongoose.Types.ObjectId(), // Simulated owner ID
        });
        const savedPost = await post.save();
        postId = savedPost._id;
    });

    test('Add a comment to a valid post', async () => {
        const response = await request(app)
            .post('/comments')
            .send({
                postId: postId.toString(),
                content: 'This is a test comment.',
                author: 'Test User',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.content).toBe('This is a test comment.');
    });

    test('Fail to add a comment to an invalid post', async () => {
        const postId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .post('/comments')
            .send({
                postId: postId,
                content: 'This should fail.',
                author: 'Test User',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Post not found: ' + postId);
    });

    test('Fetch comments for a valid post', async () => {
        await Comments.create({
            postId: postId,
            content: 'First comment',
            author: 'User1',
        });

        const response = await request(app).get(`/comments/${postId}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe('First comment');
    });

    test('Return empty list for comments of a post without comments', async () => {
        const response = await request(app).get(`/comments/${postId}`);
        expect(response.status).toBe(204);
        //expect(response.body.message).toBe('No comments found for this post');
    });

    test('Update an existing comment', async () => {
        const comment = await Comments.create({
            postId: postId,
            content: 'Old comment',
            author: 'User1',
        });

        const response = await request(app)
            .put(`/comments/${comment._id}`)
            .send({ content: 'Updated comment' });

        expect(response.status).toBe(200);
        expect(response.body.content).toBe('Updated comment');
    });

    test('Fail to update a non-existing comment', async () => {
        const response = await request(app)
            .put(`/comments/${new mongoose.Types.ObjectId()}`)
            .send({ content: 'This should fail' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Comment not found');
    });

    test('Delete an existing comment', async () => {
        const comment = await Comments.create({
            postId: postId,
            content: 'Delete me',
            author: 'User1',
        });

        const response = await request(app).delete(`/comments/${comment._id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comment deleted successfully');
    });

    test('Fail to delete a non-existing comment', async () => {
        const response = await request(app).delete(`/comments/${new mongoose.Types.ObjectId()}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Comment not found');
    });
});
