const express = require("express");
const {
    getAnnouncements,
    createAnnouncement,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
} = require("../controllers/announcementController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route('/').get(protect, getAnnouncements);
router.route('/create').post(protect, createAnnouncement);
router.route('/:id')
    .get(getAnnouncementById)
    .put(protect, updateAnnouncement)
    .delete(protect, deleteAnnouncement);

module.exports = router;
