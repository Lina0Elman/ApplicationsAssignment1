const Post = require('../models/posts_model');


exports.addPost = async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        let posts;
        // To return a post by sender
        if (req.query.sender) {
            posts = await Post.find({sender: req.query.sender});
        }
        // To return all posts
        else {
            posts = await Post.find();
        }

        if (posts.length === 0) {
            return res.status(204).json({ message: 'No posts found' });
        }

        res.json(posts);


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.post_id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};