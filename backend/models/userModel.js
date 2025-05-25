const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Defines the structure for user documents in MongoDB
 */
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

/**
 * Pre-save middleware to hash password before saving to database
 */
userSchema.pre('save', async function(next) {
    // Only hash password if it has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {boolean} - True if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;