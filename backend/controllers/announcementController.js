const Announcement = require("../models/announcementModel");
const asyncHandler = require("express-async-handler");

const getAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find();
    res.json(announcements);
});

const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        res.status(400);
        throw new Error('Please ensure that your announcement has a title and body');
    } else {
        const announcement = new Announcement({
            user: req.user._id,
            title,
            body
        });

        const createdAnnouncement = await announcement.save();
        res.status(201).json(createdAnnouncement);
    }
});

const getAnnouncementById = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        res.json(announcement);
    } else {
        res.status(404).json({ message: "Announcement not found" });
    }
});

const updateAnnouncement = asyncHandler(async (req, res) => {
    const { title, body } = req.body;

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error("Announcement not found");
    }

    if (announcement.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    announcement.title = title || announcement.title;
    announcement.body = body || announcement.body;

    const updatedAnnouncement = await announcement.save();
    res.json(updatedAnnouncement);
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error("Announcement not found");
    }

    if (announcement.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    await announcement.deleteOne();
    res.json({ message: "Announcement removed" });
});

module.exports = {
    getAnnouncements,
    createAnnouncement,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};
