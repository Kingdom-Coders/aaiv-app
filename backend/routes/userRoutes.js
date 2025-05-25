const express = require('express');
const { registerUser, authUser, deleteUser, getUsers } = require('../controllers/userControllers');
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.route('/').post(registerUser);           // POST /api/users - Register new user
router.route('/login').post(authUser);          // POST /api/users/login - Authenticate user

// Protected routes (require authentication)
router.route('/adminlist').get(protect, admin, getUsers);        // GET /api/users/adminlist - Get all users (admin only)
router.route('/delete/:id').delete(protect, admin, deleteUser);  // DELETE /api/users/delete/:id - Delete user (admin only)

module.exports = router;