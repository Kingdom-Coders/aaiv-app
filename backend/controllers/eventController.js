const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');
const User = require('../models/userModel');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, location, startDate, endDate, isAllDay } = req.body;

    // Validate required fields
    if (!title || !description || !location || !startDate || !endDate) {
        res.status(400);
        throw new Error('Please fill in all required fields');
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
        res.status(400);
        throw new Error('End date must be after start date');
    }

    if (start < new Date()) {
        res.status(400);
        throw new Error('Event start date cannot be in the past');
    }

    try {
        // Get user info to determine initial status
        const user = await User.findById(req.user._id);
        
        const event = new Event({
            title,
            description,
            location,
            startDate: start,
            endDate: end,
            isAllDay: isAllDay || false,
            createdBy: req.user._id,
            status: user.isAdmin ? 'approved' : 'pending',
            approvedBy: user.isAdmin ? req.user._id : null,
            approvedAt: user.isAdmin ? new Date() : null
        });

        const createdEvent = await event.save();
        
        // Populate creator info for response
        await createdEvent.populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: user.isAdmin ? 'Event created and approved successfully' : 'Event request submitted for admin approval',
            event: createdEvent
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error creating event: ' + error.message);
    }
});

// @desc    Get upcoming approved events
// @route   GET /api/events
// @access  Public
const getUpcomingEvents = asyncHandler(async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const events = await Event.getUpcomingEvents(limit);

        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching events: ' + error.message);
    }
});

// @desc    Get all events (for admin)
// @route   GET /api/events/all
// @access  Private/Admin
const getAllEvents = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status; // 'pending', 'approved', 'rejected', or undefined for all
        
        const skip = (page - 1) * limit;
        
        let query = {};
        if (status) {
            query.status = status;
        }

        const events = await Event.find(query)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments(query);

        res.json({
            success: true,
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching all events: ' + error.message);
    }
});

// @desc    Get pending events for admin review
// @route   GET /api/events/pending
// @access  Private/Admin
const getPendingEvents = asyncHandler(async (req, res) => {
    try {
        const events = await Event.getPendingEvents();

        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching pending events: ' + error.message);
    }
});

// @desc    Approve an event
// @route   PUT /api/events/:id/approve
// @access  Private/Admin
const approveEvent = asyncHandler(async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'firstName lastName email');

        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        if (event.status !== 'pending') {
            res.status(400);
            throw new Error('Only pending events can be approved');
        }

        await event.approve(req.user._id);
        await event.populate('approvedBy', 'firstName lastName email');

        res.json({
            success: true,
            message: 'Event approved successfully',
            event
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error approving event: ' + error.message);
    }
});

// @desc    Reject an event
// @route   PUT /api/events/:id/reject
// @access  Private/Admin
const rejectEvent = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'firstName lastName email');

        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        if (event.status !== 'pending') {
            res.status(400);
            throw new Error('Only pending events can be rejected');
        }

        await event.reject(reason || 'No reason provided');

        res.json({
            success: true,
            message: 'Event rejected successfully',
            event
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error rejecting event: ' + error.message);
    }
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName email');

        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        // Only show approved events to non-admin users
        if (event.status !== 'approved' && !req.user?.isAdmin) {
            res.status(404);
            throw new Error('Event not found');
        }

        res.json({
            success: true,
            event
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching event: ' + error.message);
    }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (owner or admin)
const updateEvent = asyncHandler(async (req, res) => {
    const { title, description, location, startDate, endDate, isAllDay } = req.body;

    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        // Check permissions - only creator or admin can update
        if (event.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(403);
            throw new Error('Not authorized to update this event');
        }

        // Validate dates if provided
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start >= end) {
                res.status(400);
                throw new Error('End date must be after start date');
            }

            if (start < new Date()) {
                res.status(400);
                throw new Error('Event start date cannot be in the past');
            }
        }

        // Update fields
        if (title) event.title = title;
        if (description) event.description = description;
        if (location) event.location = location;
        if (startDate) event.startDate = new Date(startDate);
        if (endDate) event.endDate = new Date(endDate);
        if (typeof isAllDay !== 'undefined') event.isAllDay = isAllDay;

        // If non-admin user updates approved event, reset to pending
        if (!req.user.isAdmin && event.status === 'approved') {
            event.status = 'pending';
            event.approvedBy = null;
            event.approvedAt = null;
        }

        await event.save();
        await event.populate('createdBy', 'firstName lastName email');

        res.json({
            success: true,
            message: 'Event updated successfully',
            event
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error updating event: ' + error.message);
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (owner or admin)
const deleteEvent = asyncHandler(async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        // Check permissions - only creator or admin can delete
        if (event.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            res.status(403);
            throw new Error('Not authorized to delete this event');
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error deleting event: ' + error.message);
    }
});

// @desc    Get user's events
// @route   GET /api/events/my-events
// @access  Private
const getUserEvents = asyncHandler(async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id })
            .populate('approvedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: events.length,
            events
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching user events: ' + error.message);
    }
});

module.exports = {
    createEvent,
    getUpcomingEvents,
    getAllEvents,
    getPendingEvents,
    approveEvent,
    rejectEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    getUserEvents
}; 