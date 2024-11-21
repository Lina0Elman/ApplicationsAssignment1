const postsService = require('../services/posts_service');
const {handleError} = require("../utils/handle_error");

exports.addPost = async (req, res) => {
    try {
        const savedPost = await postsService.addPost(req.body);
        res.status(201).json(savedPost);
    } catch (err) {
        handleError(err, res);
    }
};

exports.getPosts = async (req, res) => {
    try {
        let posts;
        if (req.query.sender) {
            posts = await postsService.getPosts(req.query.sender);
        } else {
            posts = await postsService.getPosts();
        }

        if (posts.length === 0) {
            res.status(204).json({ message: 'No posts found' });
        } else {
            res.json(posts);
        }
    } catch (err) {
        handleError(err, res);
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await postsService.getPostById(req.params.post_id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json(post);
        }
    } catch (err) {
        handleError(err, res);
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postData = {title: req.body.title, content: req.body.content};
        const updatedPost = await postsService.updatePost(req.params.post_id, postData);
        if (!updatedPost) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json(updatedPost);
        }
    } catch (err) {
        handleError(err, res);
    }
};