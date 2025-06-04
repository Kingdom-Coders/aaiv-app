const asyncHandler = require('express-async-handler');

// Import user model and utility functions
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User Already Exists');
    }

    // Create new user with default admin status as false
    const user = await User.create({
        firstName, 
        lastName, 
        email, 
        password, 
        isAdmin: false
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            token: generateToken(user._id),
            isAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        throw new Error('User creation error');
    }
});

/**
 * Authenticate user and get token
 * @route POST /api/users/login
 * @access Public
 */
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Verify user exists and password matches
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            token: generateToken(user._id),
            isAdmin: user.isAdmin
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

/**
 * Delete a user (Admin only)
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    // Check if requesting user has admin permissions
    if (!req.user || req.user.isAdmin !== true) {
        res.status(403);
        throw new Error("You do not have permission");
    }

    if (user) {
        await user.deleteOne();
        res.json({ message: "User Removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

/**
 * Get all users
 * @route GET /api/users
 * @access Private
 */
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

/**
 * Update user admin status (promote/demote)
 * @route PUT /api/users/:id/admin
 * @access Private/Admin
 */
const updateUserAdminStatus = asyncHandler(async (req, res) => {
    const { isAdmin } = req.body;
    const user = await User.findById(req.params.id);

    // Check if requesting user has admin permissions
    if (!req.user || req.user.isAdmin !== true) {
        res.status(403);
        throw new Error("You do not have permission");
    }

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Prevent admin from demoting themselves
    if (req.user._id.toString() === user._id.toString()) {
        res.status(400);
        throw new Error("You cannot change your own admin status");
    }

    // Update user admin status
    user.isAdmin = isAdmin;
    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
    });
});

/**
 * Delete own account (self-deletion)
 * @route DELETE /api/users/me
 * @access Private
 */
const deleteSelfAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await user.deleteOne();
        res.json({ message: "Account deleted successfully" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = { registerUser, authUser, deleteUser, getUsers, updateUserAdminStatus, deleteSelfAccount };