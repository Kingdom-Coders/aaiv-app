const express = require("express");
const { getPosts, createPost, getPostById, updatePost, deletePost } = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route('/').get(protect, getPosts);
router.route('/create').post(protect, createPost);
router.route('/:id').get(getPostById).put(protect, updatePost).delete(protect, deletePost);

module.exports = router;