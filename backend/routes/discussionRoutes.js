const express = require('express');
const { getDiscussions, createDiscussion, getDiscussionById, updateDiscussion, deleteDiscussion } = require('../controllers/discussionController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getDiscussions);
router.route('/create').post(protect, admin, createDiscussion);
router.route('/:id').get(getDiscussionById).put(protect, admin, updateDiscussion).delete(protect, deleteDiscussion);

module.exports = router;