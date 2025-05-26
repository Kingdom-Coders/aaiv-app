const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const asyncHandler = require("express-async-handler");

/**
 * Get all comments for a specific post
 * @route GET /api/comments/:postId
 * @access Private
 */
const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    // Get all comments for the post with user information
    // Sort by creation date (oldest first for chronological order)
    const comments = await Comment.find({ post: postId })
        .populate('user', 'name email') // Include user name and email
        .populate('parentComment') // Include parent comment info for nested replies
        .sort({ createdAt: 1 }); // Sort by oldest first

    res.json(comments);
});

/**
 * Create a new comment
 * @route POST /api/comments
 * @access Private
 */
const createComment = asyncHandler(async (req, res) => {
    const { postId, body, parentCommentId } = req.body;

    // Validate required fields
    if (!postId || !body) {
        res.status(400);
        throw new Error('Post ID and comment body are required');
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    // If parentCommentId is provided, verify it exists
    if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
            res.status(404);
            throw new Error("Parent comment not found");
        }
    }

    // Create new comment with authenticated user as owner
    const comment = new Comment({ 
        post: postId,
        user: req.user._id, 
        body,
        parentComment: parentCommentId || null
    });

    const createdComment = await comment.save();
    
    // Populate user info before returning
    await createdComment.populate('user', 'name email');
    
    res.status(201).json(createdComment);
});

/**
 * Update a comment
 * @route PUT /api/comments/:id
 * @access Private
 */
const updateComment = asyncHandler(async (req, res) => {
    const { body } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error("Comment not found");
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You can only edit your own comments");
    }

    // Update comment body
    comment.body = body;

    const updatedComment = await comment.save();
    await updatedComment.populate('user', 'name email');
    
    res.json(updatedComment);
});

/**
 * Delete a comment
 * @route DELETE /api/comments/:id
 * @access Private
 */
const deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error("Comment not found");
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You can only delete your own comments");
    }

    // Delete all replies to this comment first
    await Comment.deleteMany({ parentComment: req.params.id });
    
    // Delete the comment
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: "Comment deleted successfully" });
});

/**
 * Get a single comment by ID
 * @route GET /api/comments/single/:id
 * @access Private
 */
const getCommentById = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
        .populate('user', 'name email')
        .populate('parentComment');

    if (comment) {
        res.json(comment);
    } else {
        res.status(404);
        throw new Error("Comment not found");
    }
});

module.exports = {
    getCommentsByPost,
    createComment,
    updateComment,
    deleteComment,
    getCommentById,
}; 