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

router.route('/').get(protect, getAnnouncements);
// router.route('/').get(getAnnouncements);
router.route('/create').post(protect, admin, createAnnouncement);
router.route('/:id')
    .get(getAnnouncementById)
    .put(protect, admin, updateAnnouncement)
    .delete(protect, admin, deleteAnnouncement); 

module.exports = router;