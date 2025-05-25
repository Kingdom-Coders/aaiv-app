const mongoose = require("mongoose");

/**
 * Announcement Schema Definition
 * Defines the structure for announcements in MongoDB
 */
const announcementSchema = mongoose.Schema({
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
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;