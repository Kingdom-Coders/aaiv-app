const asyncHandler = require('express-async-handler');

//Grabs user schema data from our created user model (backend/models)
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async(req, res) => {
    const {firstName, lastName, email, password} = req.body;

    // Checks if user exists by checking db for email
    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400);
        throw new Error('User Already Exists');
    }

    // This is the creation of a user (.create is a MongoDB method)
    const user = await User.create({
        firstName, lastName, email, password
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error('User creation error')
    }
})

const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
    
})

module.exports={registerUser, authUser};