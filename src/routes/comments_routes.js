const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments_controller');

router.post('/', commentsController.addComment);
router.get('/', commentsController.getAllComments);
router.get('/:post_id', commentsController.getCommentsByPostId);
router.put('/:comment_id', commentsController.updateComment);
router.delete('/:comment_id', commentsController.deleteComment);

module.exports = router;
