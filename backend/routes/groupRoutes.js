const express = require("express");
const {
    getGroups,
    createGroup,
    getGroupById,
    updateGroup,
    deleteGroup
} = require("../controllers/groupController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Group routes
router.route('/').get(getGroups);                                        // GET /api/groups - Get all groups (public)
router.route('/create').post(protect, createGroup);                     // POST /api/groups/create - Create group (authenticated users)
router.route('/:id')
    .get(getGroupById)                                                   // GET /api/groups/:id - Get group by ID (public)
    .put(protect, updateGroup)                                           // PUT /api/groups/:id - Update group (owner only)
    .delete(protect, deleteGroup);                                       // DELETE /api/groups/:id - Delete group (owner only)

module.exports = router; 