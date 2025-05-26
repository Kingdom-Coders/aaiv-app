const Post = require("../models/postModel");
const asyncHandler = require("express-async-handler");

/**
 * Get all posts
 * @route GET /api/posts
 * @access Private
 */
const getPosts = asyncHandler(async (req, res) => {
    // Get all posts from all users for the discussion board with user information
    // Sort by creation date (newest first)
    const posts = await Post.find({})
        .populate('user', 'firstName lastName email') // Include user firstName, lastName and email
        .sort({ createdAt: -1 }); // Sort by newest first
    res.json(posts);
});

/**
 * Create a new post
 * @route POST /api/posts
 * @access Private
 */
const createPost = asyncHandler(async (req, res) => {
    const { title, body } = req.body;

    // Validate required fields
    if (!title || !body) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }

    // Create new post with authenticated user as owner
    const post = new Post({ 
        user: req.user._id, 
        title, 
        body 
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
});

/**
 * Get a single post by ID
 * @route GET /api/posts/:id
 * @access Private
 */
const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        res.json(post);
    } else {
        res.status(404);
        throw new Error("Post not found");
    }
});

/**
 * Update a post
 * @route PUT /api/posts/:id
 * @access Private
 */
const updatePost = asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    // Update post fields
    post.title = title;
    post.body = body;

    const updatedPost = await post.save();
    res.json(updatedPost);
});

/**
 * Delete a post
 * @route DELETE /api/posts/:id
 * @access Private
 */
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    await post.deleteOne();
    res.json({ message: "Post removed successfully" });
});

module.exports = { getPosts, createPost, getPostById, updatePost, deletePost };