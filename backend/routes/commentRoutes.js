const express = require("express");
const { 
    getCommentsByPost, 
    createComment, 
    updateComment, 
    deleteComment, 
    getCommentById 
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * Comment Routes
 * All routes require authentication
 */

// POST /api/comments - Create new comment
router.route('/').post(protect, createComment);

// GET /api/comments/:postId - Get all comments for a specific post
router.route('/:postId').get(protect, getCommentsByPost);

// GET /api/comments/single/:id - Get single comment by ID
// PUT /api/comments/single/:id - Update comment
// DELETE /api/comments/single/:id - Delete comment
router.route('/single/:id')
    .get(protect, getCommentById)
    .put(protect, updateComment)
    .delete(protect, deleteComment);

module.exports = router; 