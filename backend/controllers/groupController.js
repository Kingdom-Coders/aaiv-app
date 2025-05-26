const Group = require("../models/groupModel");
const asyncHandler = require("express-async-handler");

/**
 * Get all groups
 * @route GET /api/groups
 * @access Public
 */
const getGroups = asyncHandler(async (req, res) => {
    const groups = await Group.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    res.json(groups);
});

/**
 * Create a new group
 * @route POST /api/groups
 * @access Private
 */
const createGroup = asyncHandler(async (req, res) => {
    const { name, link, badges, description } = req.body;

    // Validate required fields
    if (!name || !link || !description) {
        res.status(400);
        throw new Error('Please ensure that your group has a name, link, and description');
    }

    // Validate badges if provided
    const validBadges = ['outdoors', 'sports', 'academic', 'social', 'other'];
    if (badges && badges.length > 0) {
        const invalidBadges = badges.filter(badge => !validBadges.includes(badge));
        if (invalidBadges.length > 0) {
            res.status(400);
            throw new Error(`Invalid badges: ${invalidBadges.join(', ')}. Valid badges are: ${validBadges.join(', ')}`);
        }
    }

    // Create new group with authenticated user as owner
    const group = new Group({
        user: req.user._id,
        name,
        link,
        badges: badges || [],
        description
    });

    const createdGroup = await group.save();
    res.status(201).json(createdGroup);
});

/**
 * Get a single group by ID
 * @route GET /api/groups/:id
 * @access Public
 */
const getGroupById = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id).populate('user', 'name email');

    if (group) {
        res.json(group);
    } else {
        res.status(404);
        throw new Error("Group not found");
    }
});

/**
 * Update a group
 * @route PUT /api/groups/:id
 * @access Private
 */
const updateGroup = asyncHandler(async (req, res) => {
    const { name, link, badges, description } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    // Check if user owns the group
    if (group.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    // Validate badges if provided
    const validBadges = ['outdoors', 'sports', 'academic', 'social', 'other'];
    if (badges && badges.length > 0) {
        const invalidBadges = badges.filter(badge => !validBadges.includes(badge));
        if (invalidBadges.length > 0) {
            res.status(400);
            throw new Error(`Invalid badges: ${invalidBadges.join(', ')}. Valid badges are: ${validBadges.join(', ')}`);
        }
    }

    // Update group fields (only if provided)
    group.name = name || group.name;
    group.link = link || group.link;
    group.badges = badges !== undefined ? badges : group.badges;
    group.description = description || group.description;

    const updatedGroup = await group.save();
    res.json(updatedGroup);
});

/**
 * Delete a group
 * @route DELETE /api/groups/:id
 * @access Private
 */
const deleteGroup = asyncHandler(async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (!group) {
        res.status(404);
        throw new Error("Group not found");
    }

    // Check if user owns the group
    if (group.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("You cannot perform this action");
    }

    await group.deleteOne();
    res.json({ message: "Group removed successfully" });
});

module.exports = {
    getGroups,
    createGroup,
    getGroupById,
    updateGroup,
    deleteGroup
}; 