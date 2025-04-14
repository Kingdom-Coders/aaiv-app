const mongoose = require("mongoose");

const announcementSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        title: {
            type: String,
            required: true,
        },

        body: {
            type: String,
            required: true,
        },
    },
    {
        timestamps:true,
    }
);

const Announcement = mongoose.model("Announcement", announcementSchema)

module.exports = Announcement;