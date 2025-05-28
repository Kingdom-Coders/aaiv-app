const express = require('express');
const {
    createReport,
    getPendingReports,
    getAllReports,
    reviewReport,
    dismissReport
} = require('../controllers/reportController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public user routes (protected)
router.post('/', protect, createReport);

// Admin only routes
router.get('/pending', protect, admin, getPendingReports);
router.get('/', protect, admin, getAllReports);
router.put('/:id/review', protect, admin, reviewReport);
router.put('/:id/dismiss', protect, admin, dismissReport);

module.exports = router; 