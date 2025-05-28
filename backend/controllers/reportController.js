const Report = require("../models/reportModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const asyncHandler = require("express-async-handler");

/**
 * Create a new report
 * @route POST /api/reports
 * @access Private
 */
const createReport = asyncHandler(async (req, res) => {
    const { contentType, contentId, reason, description } = req.body;

    // Validate required fields
    if (!contentType || !contentId || !reason) {
        res.status(400);
        throw new Error('Content type, content ID, and reason are required');
    }

    // Validate content type
    if (!['post', 'comment'].includes(contentType)) {
        res.status(400);
        throw new Error('Content type must be either "post" or "comment"');
    }

    let content;
    let contentModel;
    let originalAuthor;

    // Verify content exists and get original author
    if (contentType === 'post') {
        content = await Post.findById(contentId);
        contentModel = 'Post';
        if (!content) {
            res.status(404);
            throw new Error("Post not found");
        }
        originalAuthor = content.user;
    } else {
        content = await Comment.findById(contentId);
        contentModel = 'Comment';
        if (!content) {
            res.status(404);
            throw new Error("Comment not found");
        }
        originalAuthor = content.user;
    }

    // Prevent users from reporting their own content
    if (originalAuthor.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error("You cannot report your own content");
    }

    try {
        // Create new report
        const report = new Report({
            contentType,
            contentId,
            contentModel,
            reportedBy: req.user._id,
            originalAuthor,
            reason,
            description: description || ''
        });

        const createdReport = await report.save();
        
        // Populate the report with user info before returning
        await createdReport.populate('reportedBy', 'firstName lastName email');
        await createdReport.populate('originalAuthor', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Content reported successfully',
            report: createdReport
        });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error - user already reported this content
            res.status(400);
            throw new Error('You have already reported this content');
        }
        throw error;
    }
});

/**
 * Get all pending reports (Admin only)
 * @route GET /api/reports/pending
 * @access Private/Admin
 */
const getPendingReports = asyncHandler(async (req, res) => {
    try {
        const reports = await Report.getPendingReports();

        res.json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching pending reports: ' + error.message);
    }
});

/**
 * Get all reports (Admin only)
 * @route GET /api/reports
 * @access Private/Admin
 */
const getAllReports = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status; // 'pending', 'reviewed', 'resolved', 'dismissed', or undefined for all
        
        const skip = (page - 1) * limit;
        
        let query = {};
        if (status) {
            query.status = status;
        }

        const reports = await Report.find(query)
            .populate('reportedBy', 'firstName lastName email')
            .populate('originalAuthor', 'firstName lastName email')
            .populate('reviewedBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Manually populate content based on contentModel
        for (let report of reports) {
            if (report.contentModel === 'Post') {
                await report.populate('contentId', 'title body user createdAt');
            } else if (report.contentModel === 'Comment') {
                await report.populate('contentId', 'body user post createdAt');
            }
        }

        const total = await Report.countDocuments(query);

        res.json({
            success: true,
            reports,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error fetching reports: ' + error.message);
    }
});

/**
 * Review a report and optionally delete content (Admin only)
 * @route PUT /api/reports/:id/review
 * @access Private/Admin
 */
const reviewReport = asyncHandler(async (req, res) => {
    const { adminNotes, actionTaken, deleteContent } = req.body;

    try {
        const report = await Report.findById(req.params.id)
            .populate('reportedBy', 'firstName lastName email')
            .populate('originalAuthor', 'firstName lastName email');

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        // Manually populate content based on contentModel
        if (report.contentModel === 'Post') {
            await report.populate('contentId', 'title body user createdAt');
        } else if (report.contentModel === 'Comment') {
            await report.populate('contentId', 'body user post createdAt');
        }

        if (report.status !== 'pending') {
            res.status(400);
            throw new Error('Only pending reports can be reviewed');
        }

        // If admin chooses to delete the content
        if (deleteContent) {
            if (report.contentType === 'post') {
                await Post.findByIdAndDelete(report.contentId);
            } else {
                // Delete comment and its replies
                await Comment.deleteMany({ parentComment: report.contentId });
                await Comment.findByIdAndDelete(report.contentId);
            }
        }

        // Mark report as reviewed
        await report.markAsReviewed(
            req.user._id, 
            adminNotes || '', 
            deleteContent ? 'content_deleted' : (actionTaken || 'none')
        );

        await report.populate('reviewedBy', 'firstName lastName email');

        res.json({
            success: true,
            message: deleteContent ? 'Content deleted and report reviewed' : 'Report reviewed successfully',
            report
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error reviewing report: ' + error.message);
    }
});

/**
 * Dismiss a report (Admin only)
 * @route PUT /api/reports/:id/dismiss
 * @access Private/Admin
 */
const dismissReport = asyncHandler(async (req, res) => {
    const { adminNotes } = req.body;

    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            res.status(404);
            throw new Error('Report not found');
        }

        if (report.status !== 'pending') {
            res.status(400);
            throw new Error('Only pending reports can be dismissed');
        }

        report.status = 'dismissed';
        report.reviewedBy = req.user._id;
        report.reviewedAt = new Date();
        report.adminNotes = adminNotes || '';
        report.actionTaken = 'none';

        await report.save();
        await report.populate('reviewedBy', 'firstName lastName email');
        await report.populate('reportedBy', 'firstName lastName email');
        await report.populate('originalAuthor', 'firstName lastName email');

        res.json({
            success: true,
            message: 'Report dismissed successfully',
            report
        });
    } catch (error) {
        res.status(500);
        throw new Error('Error dismissing report: ' + error.message);
    }
});

module.exports = {
    createReport,
    getPendingReports,
    getAllReports,
    reviewReport,
    dismissReport
}; 