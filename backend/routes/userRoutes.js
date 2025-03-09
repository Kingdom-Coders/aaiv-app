const express = require('express');
const { registerUser, authUser } = require('../controllers/userControllers');
const router = express.Router();

// This means when a POST request is sent to /api/users, it calls registerUser (from backend/controllers)
router.route('/').post(registerUser);
// This means when a POST request is sent to /api/users/login, it calls authUser (from backend/controllers)
router.route('/login').post(authUser);

module.exports = router;