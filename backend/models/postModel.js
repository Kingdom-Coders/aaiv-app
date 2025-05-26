const mongoose = require("mongoose");

/**
 * Post Schema Definition
 * Defines the structure for discussion board posts in MongoDB
 */
const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // Reference to User model
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    bibleVerse: {
        reference: {
            type: String,
            required: false,
        },
        text: {
            type: String,
            required: false,
        },
        translation: {
            type: String,
            required: false,
            default: "web"
        }
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;