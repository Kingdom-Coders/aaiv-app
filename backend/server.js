// import packages
const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const notes = require('./data/notes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler} = require('./middlewares/errorMiddleware');

// create an object of imported express package
const app = express();
dotenv.config();
app.use(cors());
connectDB();
app.use(express.json());

// GET request from backend to frontend
app.get('/', (req, res) => {
    res.send("API is running...");
})

// Tells express that all reqs to /api/users should be handled by userRoutes.js (in backend/routes)
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

// Gets the port number from .env file but if it doesnt exist then we have default val
const PORT = process.env.PORT || 5001;

// create express webserver (port number, console log)
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));