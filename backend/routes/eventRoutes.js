const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/eventController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getUpcomingEvents);

// Protected routes (authenticated users) - specific routes first
router.post('/', protect, createEvent);
router.get('/my-events', protect, getUserEvents);

// Admin-only routes - specific routes first
router.get('/admin', protect, admin, getAllEvents);
router.get('/pending', protect, admin, getPendingEvents);

// Parameterized routes come last to avoid conflicts
router.get('/:id', getEventById);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.put('/:id/approve', protect, admin, approveEvent);
router.put('/:id/reject', protect, admin, rejectEvent);

module.exports = router; 