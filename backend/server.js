// Core dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const session = require('express-session');

// Database imports
const connectDB = require("./config/db");

// Route imports
const userRoutes = require('./routes/userRoutes');
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const googleRoutes = require("./routes/calendarRoutes");
const announcementRoutes = require('./routes/announcementRoutes');

// Middleware imports
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Google APIs
const { google } = require('googleapis');

// Initialize Express app and configure environment
const app = express();
dotenv.config();

// Database connection
connectDB();

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'a default fallback secret - change me!',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
        maxAge: 1000 * 60 * 60 * 24 // Cookie expires in 24 hours
    }
}));

// Root endpoint - API health check
app.get('/', (req, res) => {
    res.send("API is running...");
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/announcements', announcementRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});