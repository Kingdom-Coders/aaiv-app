// import packages here
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variable MONGO_URI for connection string
 */
const connectDB = async () => {
    // try catch -> similar to for loop but just catches the error logic for you
    // await for mongodb connection, if we do not get one we throw an error
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true, 
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure code
    }
};

module.exports = connectDB;