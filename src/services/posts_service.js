const Post = require('../models/posts_model');

exports.addPost = async (postData) => {
    const newPost = new Post(postData);
    return await newPost.save();
};

exports.getPosts = async (owner) => {
    if (owner) {
        return Post.find({owner});
    } else {
        return Post.find();
    }
};

exports.getPostById = async (postId) => {
    return Post.findById(postId);
};

exports.updatePost = async (postId, postData) => {
    return Post.findByIdAndUpdate(postId, {...postData}, {new: true, runValidators:true});
};
