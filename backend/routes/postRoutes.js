const express = require("express");
const { getPosts, createPost, getPostById, updatePost, deletePost } = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// All post routes require authentication
router.route('/').get(protect, getPosts);                                    // GET /api/posts - Get all posts
router.route('/create').post(protect, createPost);                          // POST /api/posts/create - Create new post
router.route('/:id')
    .get(getPostById)                                                        // GET /api/posts/:id - Get post by ID
    .put(protect, updatePost)                                                // PUT /api/posts/:id - Update post
    .delete(protect, deletePost);                                            // DELETE /api/posts/:id - Delete post

module.exports = router;