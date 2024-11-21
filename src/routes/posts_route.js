const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_controller');

router.post('/', postsController.addPost);
router.get('/', postsController.getPosts);
router.get('/:post_id', postsController.getPostById);
router.put('/:post_id', postsController.updatePost);
router.patch('/:post_id', postsController.updatePost);

module.exports = router;