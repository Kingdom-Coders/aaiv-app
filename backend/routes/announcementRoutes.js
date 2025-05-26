const express = require("express");
const {
    getAnnouncements,
    createAnnouncement,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Announcement routes
router.route('/').get(getAnnouncements);                                     // GET /api/announcements - Get all announcements (public)
router.route('/create').post(protect, admin, createAnnouncement);           // POST /api/announcements/create - Create announcement (admin only)
router.route('/:id')
    .get(getAnnouncementById)                                                // GET /api/announcements/:id - Get announcement by ID
    .put(protect, admin, updateAnnouncement)                                 // PUT /api/announcements/:id - Update announcement (admin only)
    .delete(protect, admin, deleteAnnouncement);                             // DELETE /api/announcements/:id - Delete announcement (admin only)

module.exports = router;