
const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        verses: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        applicationQuestions: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
const Discussion = mongoose.model('Discussion', discussionSchema);
module.exports = Discussion;
