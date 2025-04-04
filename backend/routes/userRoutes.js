const express = require('express');
const { registerUser, authUser, deleteUser, getUsers } = require('../controllers/userControllers');
const { protect, admin } = require("../middlewares/authMiddleware");
const router = express.Router();

// This means when a POST request is sent to /api/users, it calls registerUser (from backend/controllers)
router.route('/').post(registerUser);
// This means when a POST request is sent to /api/users/login, it calls authUser (from backend/controllers)
router.route('/login').post(authUser);
// This means when a DELETE request is sent to /api/users/delete/:id, it calls deleteUser (from backend/controllers)
router.route('/delete/:id').delete(protect, admin, deleteUser);
// GET req at /api/users/adminlist, calls getUsers
router.route('/adminlist').get(protect, admin, getUsers)

module.exports = router;