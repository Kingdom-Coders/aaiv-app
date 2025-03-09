const Post = require("../models/postModel");
const asyncHandler = require("express-async-handler");

const getPosts = asyncHandler(async (req, res) => {
    // Difference between this is that the posts takes from all or just the users
    // const posts = await Post.find({user: req.user._id})
    const posts = await Post.find()
    res.json(posts);
});

const createPost = asyncHandler(async(req, res) => {
    const { user, title, body } = req.body;

    if (!title || !body) {
        res.status(400);
        throw new Error('Please fill all the fields');
    } else {
        const post = new Post({ user: req.user._id, title, body});

        const createdPost = await post.save();

        res.status(201).json(createdPost);
    }
});

const getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if(post) {
        res.json(post);
    } else {
        res.status(404).json({ message: "Post not found" });
    }
});

const updatePost = asyncHandler(async (req, res) => {
    const { title, body} = req.body;

    const post = await Post.findById(req.params.id);

    if(post.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    if(post) {
        post.title = title;
        post.body = body;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } else {
        res.status(404);
        throw new Error("Note not found");
    }
});

const deletePost = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id);

    if(post.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    if(post){
        await post.deleteOne();
        res.json({message: "Note Removed"});
    } else {
        res.status(404);
        throw new Error("Note not found");
    }
});

module.exports = { getPosts, createPost, getPostById, updatePost, deletePost };