const Discussion = require("../models/discussionModel");
const asyncHandler = require("express-async-handler");

const getDiscussions = asyncHandler(async (req, res) => {
    const discussions = await Discussion.find();
    res.json(discussions);
})

const createDiscussion = asyncHandler(async (req, res) => {
    const { verses, date, title, applicationQuestions } = req.body;
    if (!title || !verses || !date || !applicationQuestions) {
        res.status(400);
        throw new Error('Please ensure that your discussion post has a verse, date, title, and application questions.');
    } else {
        const discussion = new Discussion({
            user: req.user._id,
            verses,
            date,
            title,
            applicationQuestions
        })
        const createdDiscussion = await discussion.save();
        res.status(201).json(createdDiscussion);
    }
});

const getDiscussionById = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);

    if (discussion) {
        res.json(discussion);
    } else {
        res.status(404).json({ message: "Discussion not found" });
    }
});

const updateDiscussion = asyncHandler(async (req, res) => { 
    const { verses, date, title, applicationQuestions } = req.body;

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        res.status(404);
        throw new Error("Discussion not found");
    }

    if (discussion.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    discussion.verses = verses || discussion.verses;
    discussion.date = date || discussion.date;
    discussion.title = title || discussion.title;
    discussion.applicationQuestions = applicationQuestions || discussion.applicationQuestions;

    const updatedDiscussion = await discussion.save();
    res.json(updatedDiscussion);
}
);
const deleteDiscussion = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
        res.status(404);
        throw new Error("Discussion not found");
    }

    if (discussion.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    await discussion.remove();
    res.json({ message: "Discussion removed" });
});

module.exports = {
    getDiscussions,
    createDiscussion,
    getDiscussionById,
    updateDiscussion,
    deleteDiscussion
};
