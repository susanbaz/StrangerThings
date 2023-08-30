const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

router.get('/', postsController.getAllPosts);
router.post('/', postsController.createPost);
router.delete('/:postId', postsController.deletePost);

module.exports = router;
