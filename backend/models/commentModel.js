const mongoose = require("mongoose");

/**
 * Comment Schema Definition
 * Defines the structure for comments/replies on discussion board posts in MongoDB
 */
const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post", // Reference to Post model
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to User model
    },
    body: {
        type: String,
        required: true,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to parent comment for nested replies
        default: null,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment; 