// import packages
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const notes = require('./data/notes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require("./routes/postRoutes");
const googleRoutes = require("./routes/calendarRoutes");
const {google} = require('googleapis');
const session = require('express-session');
const announcementRoutes = require('./routes/announcementRoutes');
const { notFound, errorHandler} = require('./middlewares/errorMiddleware');

// create an object of imported express package
const app = express();
dotenv.config();
app.use(cors());
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET request from backend to frontend
app.get('/', (req, res) => {
    res.send("API is running...");
})

app.use(session({
    secret: process.env.SESSION_SECRET || 'a default fallback secret - change me!', // Use a strong secret from .env
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored (optional, true works too)
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
        maxAge: 1000 * 60 * 60 * 24 // Example: cookie expires in 24 hours
    }
}));

// Tells express that all reqs to /api/users should be handled by userRoutes.js (in backend/routes)
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/announcements', announcementRoutes);

app.use(notFound);
app.use(errorHandler);

// Gets the port number from .env file but if it doesnt exist then we have default val
const PORT = process.env.PORT || 5001;

// create express webserver (port number, console log)
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));