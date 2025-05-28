const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    // Event status: 'pending', 'approved', 'rejected'
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function() {
            // If creator is admin, auto-approve; otherwise pending
            return this.createdBy.isAdmin ? 'approved' : 'pending';
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
eventSchema.index({ startDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ createdBy: 1 });

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
    return this.startDate > new Date();
});

// Virtual for formatted date range
eventSchema.virtual('dateRange').get(function() {
    const start = this.startDate;
    const end = this.endDate;
    
    if (this.isAllDay) {
        if (start.toDateString() === end.toDateString()) {
            return start.toLocaleDateString();
        } else {
            return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
        }
    } else {
        if (start.toDateString() === end.toDateString()) {
            return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else {
            return `${start.toLocaleString()} - ${end.toLocaleString()}`;
        }
    }
});

// Method to approve event
eventSchema.methods.approve = function(approvedByUserId) {
    this.status = 'approved';
    this.approvedBy = approvedByUserId;
    this.approvedAt = new Date();
    this.rejectionReason = undefined;
    return this.save();
};

// Method to reject event
eventSchema.methods.reject = function(rejectionReason) {
    this.status = 'rejected';
    this.rejectionReason = rejectionReason;
    this.approvedBy = null;
    this.approvedAt = null;
    return this.save();
};

// Static method to get upcoming approved events
eventSchema.statics.getUpcomingEvents = function(limit = 10) {
    return this.find({
        status: 'approved',
        endDate: { $gte: new Date() }
    })
    .populate('createdBy', 'firstName lastName email')
    .sort({ startDate: 1 })
    .limit(limit);
};

// Static method to get pending events for admin review
eventSchema.statics.getPendingEvents = function() {
    return this.find({ status: 'pending' })
    .populate('createdBy', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 