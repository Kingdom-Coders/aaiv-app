const Announcement = require("../models/announcementModel");
const asyncHandler = require("express-async-handler");

/**
 * Get all announcements
 * @route GET /api/announcements
 * @access Public
 */
const getAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.json(announcements);
});

/**
 * Create a new announcement
 * @route POST /api/announcements
 * @access Private
 */
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, body } = req.body;

    // Validate required fields
    if (!title || !body) {
        res.status(400);
        throw new Error('Please ensure that your announcement has a title and body');
    }

    // Create new announcement with authenticated user as owner
    const announcement = new Announcement({
        user: req.user._id,
        title,
        body
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
});

/**
 * Get a single announcement by ID
 * @route GET /api/announcements/:id
 * @access Private
 */
const getAnnouncementById = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        res.json(announcement);
    } else {
        res.status(404);
        throw new Error("Announcement not found");
    }
});

/**
 * Update an announcement
 * @route PUT /api/announcements/:id
 * @access Private/Admin
 */
const updateAnnouncement = asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error("Announcement not found");
    }

    // Since this route requires admin privileges (protect, admin middleware),
    // admins can update any announcement
    announcement.title = title || announcement.title;
    announcement.body = body || announcement.body;

    const updatedAnnouncement = await announcement.save();
    res.json(updatedAnnouncement);
});

/**
 * Delete an announcement
 * @route DELETE /api/announcements/:id
 * @access Private/Admin
 */
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error("Announcement not found");
    }

    // Since this route requires admin privileges (protect, admin middleware),
    // admins can delete any announcement
    await announcement.deleteOne();
    res.json({ message: "Announcement removed successfully" });
});

module.exports = {
    getAnnouncements,
    createAnnouncement,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};
