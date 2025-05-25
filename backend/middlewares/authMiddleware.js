const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

/**
 * Middleware to protect routes - verifies JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if authorization header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(" ")[1];
            
            // Verify and decode the JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token and attach to request (excluding password)
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    // If no token provided
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

/**
 * Middleware to check if user has admin privileges
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as admin");
    }
};

module.exports = { protect, admin };