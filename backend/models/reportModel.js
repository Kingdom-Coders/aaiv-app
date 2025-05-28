const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    // What is being reported
    contentType: {
        type: String,
        enum: ['post', 'comment'],
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'contentModel'
    },
    contentModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    },
    
    // Who reported it
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Who originally created the content
    originalAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Report details
    reason: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    
    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    },
    
    // Admin action
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    adminNotes: {
        type: String,
        trim: true
    },
    
    // Action taken
    actionTaken: {
        type: String,
        enum: ['none', 'content_deleted', 'warning_issued', 'user_warned'],
        default: 'none'
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
reportSchema.index({ contentType: 1, contentId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate reports from same user for same content
reportSchema.index({ contentId: 1, reportedBy: 1 }, { unique: true });

// Virtual to get content details
reportSchema.virtual('content', {
    ref: function() { return this.contentModel; },
    localField: 'contentId',
    foreignField: '_id',
    justOne: true
});

// Static method to get pending reports for admin
reportSchema.statics.getPendingReports = async function() {
    const reports = await this.find({ status: 'pending' })
        .populate('reportedBy', 'firstName lastName email')
        .populate('originalAuthor', 'firstName lastName email')
        .sort({ createdAt: -1 });
    
    // Manually populate content based on contentModel
    for (let report of reports) {
        if (report.contentModel === 'Post') {
            await report.populate('contentId', 'title body user createdAt');
        } else if (report.contentModel === 'Comment') {
            await report.populate('contentId', 'body user post createdAt');
        }
    }
    
    return reports;
};

// Method to mark as reviewed
reportSchema.methods.markAsReviewed = function(reviewedByUserId, adminNotes = '', actionTaken = 'none') {
    this.status = 'reviewed';
    this.reviewedBy = reviewedByUserId;
    this.reviewedAt = new Date();
    this.adminNotes = adminNotes;
    this.actionTaken = actionTaken;
    return this.save();
};

const Report = mongoose.model('Report', reportSchema);

module.exports = Report; 