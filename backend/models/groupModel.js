const mongoose = require("mongoose");

/**
 * Group Schema Definition
 * Defines the structure for chat groups in MongoDB
 */
const groupSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to User model
    },
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    badges: [{
        type: String,
        enum: ['outdoors', 'sports', 'academic', 'social', 'faith', 'links', 'chats', 'other'],
    }],
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group; 