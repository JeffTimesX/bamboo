const express = require('express');
const router = express.Router();

const post = require('../controllers/post.js');

router.get('/post/:id', post.getPostById)
router.get('/user/:id', post.getPostsByUserId)
router.get('/title/:title', post.getPostsByTitle)

router.post('/:userId', post.createPost)
router.delete('/:id', post.deletePost)

module.exports = router;