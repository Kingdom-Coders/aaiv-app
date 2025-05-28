import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserList from '../../components/UserList';
import './Admin.css';
import { 
  createAnnouncementAction, 
  listAnnouncements, 
  deleteAnnouncementAction,
  getAllAnnouncementsAction
} from '../../actions/announcementActions';
import { 
  getPendingReportsAction, 
  getAllReportsAction, 
  reviewReportAction, 
  dismissReportAction 
} from '../../actions/reportActions';
import { Tabs } from '@chakra-ui/react';
import { LuMegaphone, LuUser, LuFlag } from 'react-icons/lu';
import usePullToRefresh from '../../hooks/usePullToRefresh';
import PullToRefreshIndicator from '../../components/PullToRefreshIndicator';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeReportsTab, setActiveReportsTab] = useState('pending');
  
  const dispatch = useDispatch();
  
  // Get announcement states from Redux
  const announcementCreate = useSelector((state) => state.announcementCreate);
  const { loading: createLoading, error: createError, success: createSuccess } = announcementCreate;
  
  const announcementList = useSelector((state) => state.announcementList);
  const { loading: listLoading, announcements, error: listError } = announcementList;
  
  const announcementDelete = useSelector((state) => state.announcementDelete);
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = announcementDelete;

  // Get report states from Redux
  const reportPending = useSelector((state) => state.reportPending);
  const { loading: pendingLoading, reports: pendingReports, error: pendingError } = reportPending;
  
  const reportList = useSelector((state) => state.reportList);
  const { loading: allReportsLoading, reports: allReports, error: allReportsError } = reportList;
  
  const reportReview = useSelector((state) => state.reportReview);
  const { loading: reviewLoading, success: reviewSuccess, error: reviewError } = reportReview;
  
  const reportDismiss = useSelector((state) => state.reportDismiss);
  const { loading: dismissLoading, success: dismissSuccess, error: dismissError } = reportDismiss;

  // Pull-to-refresh functionality
  const {
    isPulling,
    isRefreshing,
    pullDistance,
    refreshProgress
  } = usePullToRefresh(() => {
    dispatch(listAnnouncements());
    dispatch(getPendingReportsAction());
    dispatch(getAllReportsAction());
  });

  // Load announcements when component mounts
  useEffect(() => {
    dispatch(listAnnouncements());
  }, [dispatch]);

  // Load reports when component mounts
  useEffect(() => {
    console.log('Admin: Loading reports...');
    dispatch(getPendingReportsAction());
    dispatch(getAllReportsAction());
  }, [dispatch]);

  // Debug report data
  useEffect(() => {
    console.log('Pending reports data:', { pendingReports, pendingLoading, pendingError });
    console.log('All reports data:', { allReports, allReportsLoading, allReportsError });
  }, [pendingReports, pendingLoading, pendingError, allReports, allReportsLoading, allReportsError]);
  
  // Handle status messages
  useEffect(() => {
    if (createSuccess) {
      setTitle('');
      setBody('');
      setStatusMessage({ type: 'success', text: 'Announcement created successfully' });
      dispatch(listAnnouncements()); // Refresh the list
    }
    
    if (deleteSuccess) {
      setStatusMessage({ type: 'success', text: 'Announcement deleted successfully' });
      dispatch(listAnnouncements()); // Refresh the list
    }

    if (reviewSuccess) {
      setStatusMessage({ type: 'success', text: 'Report reviewed successfully' });
      dispatch(getPendingReportsAction()); // Refresh pending reports
      dispatch(getAllReportsAction()); // Refresh all reports
    }

    if (dismissSuccess) {
      setStatusMessage({ type: 'success', text: 'Report dismissed successfully' });
      dispatch(getPendingReportsAction()); // Refresh pending reports
      dispatch(getAllReportsAction()); // Refresh all reports
    }
    
    if (createError) {
      setStatusMessage({ type: 'error', text: `Error creating announcement: ${createError}` });
    }
    
    if (deleteError) {
      setStatusMessage({ type: 'error', text: `Error deleting announcement: ${deleteError}` });
    }

    if (reviewError) {
      setStatusMessage({ type: 'error', text: `Error reviewing report: ${reviewError}` });
    }

    if (dismissError) {
      setStatusMessage({ type: 'error', text: `Error dismissing report: ${dismissError}` });
    }
    
    if (listError) {
      setStatusMessage({ type: 'error', text: `Error loading announcements: ${listError}` });
    }

    if (pendingError) {
      setStatusMessage({ type: 'error', text: `Error loading pending reports: ${pendingError}` });
    }

    if (allReportsError) {
      setStatusMessage({ type: 'error', text: `Error loading reports: ${allReportsError}` });
    }
    
    // Clear status message after 5 seconds
    const timer = setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [createSuccess, deleteSuccess, reviewSuccess, dismissSuccess, createError, deleteError, reviewError, dismissError, listError, pendingError, allReportsError, dispatch]);
  
  // Handle submit of new announcement
  const submitHandler = (e) => {
    e.preventDefault();
    if (!title || !body) {
      setStatusMessage({ type: 'warning', text: 'Please provide both title and body for the announcement' });
      return;
    }
    dispatch(createAnnouncementAction(title, body));
  };
  
  // Handle delete announcement
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      dispatch(deleteAnnouncementAction(id));
    }
  };

  // Handle review report (approve action)
  const handleReviewReport = (reportId, actionTaken, deleteContent = false) => {
    const actionText = deleteContent ? 'remove the content and mark this report as reviewed' : `mark this report as ${actionTaken}`;
    if (window.confirm(`Are you sure you want to ${actionText}?`)) {
      dispatch(reviewReportAction(reportId, actionTaken, deleteContent));
    }
  };

  // Handle dismiss report
  const handleDismissReport = (reportId) => {
    if (window.confirm("Are you sure you want to dismiss this report?")) {
      dispatch(dismissReportAction(reportId));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'dismissed':
        return 'status-dismissed';
      default:
        return 'status-pending';
    }
  };

  // Render reported content
  const renderReportedContent = (report) => {
    if (!report.contentId) {
      return <div className="reported-content-missing">Content no longer available</div>;
    }

    if (report.contentType === 'post') {
      return (
        <div className="reported-content">
          <div className="content-header">
            <strong>Reported Post:</strong>
          </div>
          <div className="content-title">
            <strong>Title:</strong> {report.contentId.title || 'Untitled'}
          </div>
          <div className="content-body">
            <strong>Body:</strong>
            <div className="content-text">
              {report.contentId.body ? 
                (report.contentId.body.length > 200 ? 
                  `${report.contentId.body.substring(0, 200)}...` : 
                  report.contentId.body) 
                : 'No content'}
            </div>
          </div>
          {report.contentId.user && (
            <div className="content-author">
              <strong>Author:</strong> {report.contentId.user.firstName} {report.contentId.user.lastName}
            </div>
          )}
        </div>
      );
    } else if (report.contentType === 'comment') {
      return (
        <div className="reported-content">
          <div className="content-header">
            <strong>Reported Comment:</strong>
          </div>
          <div className="content-body">
            <strong>Comment:</strong>
            <div className="content-text">
              {report.contentId.body ? 
                (report.contentId.body.length > 200 ? 
                  `${report.contentId.body.substring(0, 200)}...` : 
                  report.contentId.body) 
                : 'No content'}
            </div>
          </div>
          {report.contentId.user && (
            <div className="content-author">
              <strong>Author:</strong> {report.contentId.user.firstName} {report.contentId.user.lastName}
            </div>
          )}
        </div>
      );
    }

    return <div className="reported-content-unknown">Unknown content type</div>;
  };

  return (
    <>
      {/* Pull-to-refresh indicator */}
      <PullToRefreshIndicator 
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        refreshProgress={refreshProgress}
      />
      
      <Tabs.Root defaultValue="members">
      <div className="admin-screen">
        <h1 className="titleText">👨‍💻 Admin Screen</h1>
        <Tabs.List>
          <Tabs.Trigger value="members">
            <LuUser />
            Members
          </Tabs.Trigger>
          <Tabs.Trigger value="announcements">
            <LuMegaphone />
            Announcements
          </Tabs.Trigger>
          <Tabs.Trigger value="reports">
            <LuFlag />
            Reports
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="members"><UserList /></Tabs.Content>
        <Tabs.Content value="announcements">
        {/* Status Alert */}
        {statusMessage && (
          <div className={`alert alert-${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

          {/* Create Announcement Form */}
          <div className="announcement-post">
          <div className="announcement-title">
            <h1>📝 Create New Announcement</h1>
          </div>
          <form onSubmit={submitHandler}>
            <h2>Title</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-input"
              placeholder="Enter announcement title"
            />
            
            <h2>Body</h2>
            <div className="text-area">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="textarea-input"
                placeholder="Enter announcement body"
              />
            </div>
            
            <div className="button">
              <button 
                type="submit" 
                className="submit-button"
                disabled={createLoading}
              >
                {createLoading ? 'Posting...' : 'Post Announcement'}
              </button>
            </div>
          </form> 
          
        </div>

        {/* Announcements List */}
        <div className="announcements-list">
          <h2 className="section-heading">📋 Current Announcements</h2>
          
          {listLoading ? (
            <div className="loading-spinner"></div>
          ) : listError ? (
            <div className="error-message">Error loading announcements</div>
          ) : (
            <>
              {announcements && announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div 
                    key={announcement._id} 
                    className="announcement-item"
                  >
                    <h3 className="announcement-title">{announcement.title}</h3>
                    <div className="announcement-body">{announcement.body}</div>
                    <button 
                      className="delete-button"
                      onClick={() => deleteHandler(announcement._id)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                ))
              ) : (
                <div>No announcements yet</div>
              )}
            </>
          )}
        </div>
        
        </Tabs.Content>
        <Tabs.Content value="reports">
          <div className="reports-section">
            <h2 className="section-heading">🚩 Reports Management</h2>
            
            {/* Reports Sub-tabs */}
            <div className="reports-tabs">
              <button 
                className={`tab-button ${activeReportsTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveReportsTab('pending')}
              >
                Pending Reports ({pendingReports ? pendingReports.length : 0})
              </button>
              <button 
                className={`tab-button ${activeReportsTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveReportsTab('all')}
              >
                All Reports ({allReports ? allReports.length : 0})
              </button>
            </div>

            {/* Pending Reports */}
            {activeReportsTab === 'pending' && (
              <div className="reports-list">
                <h3>Pending Reports</h3>
                {pendingLoading ? (
                  <div className="loading-spinner"></div>
                ) : pendingError ? (
                  <div className="error-message">Error loading pending reports</div>
                ) : (
                  <>
                    {pendingReports && pendingReports.length > 0 ? (
                      pendingReports.map((report) => (
                        <div key={report._id} className="report-item">
                          <div className="report-header">
                            <span className={`status-badge ${getStatusBadge(report.status)}`}>
                              {report.status}
                            </span>
                            <span className="report-date">{formatDate(report.createdAt)}</span>
                          </div>
                          <div className="report-content">
                            <div className="report-info">
                              <strong>Type:</strong> {report.contentType} | 
                              <strong> Reason:</strong> {report.reason} |
                              <strong> Reporter:</strong> {report.reportedBy?.firstName} {report.reportedBy?.lastName}
                            </div>
                            <div className="report-description">
                              <strong>Description:</strong> {report.description}
                            </div>
                            {report.customReason && (
                              <div className="report-custom-reason">
                                <strong>Custom Reason:</strong> {report.customReason}
                              </div>
                            )}
                            {/* Display the actual reported content */}
                            {renderReportedContent(report)}
                          </div>
                          <div className="report-actions">
                            <button 
                              className="action-button approve"
                              onClick={() => handleReviewReport(report._id, 'content_removed', true)}
                              disabled={reviewLoading}
                            >
                              Remove Content
                            </button>
                            <button 
                              className="action-button dismiss"
                              onClick={() => handleDismissReport(report._id)}
                              disabled={dismissLoading}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-reports">No pending reports</div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* All Reports */}
            {activeReportsTab === 'all' && (
              <div className="reports-list">
                <h3>All Reports</h3>
                {allReportsLoading ? (
                  <div className="loading-spinner"></div>
                ) : allReportsError ? (
                  <div className="error-message">Error loading reports</div>
                ) : (
                  <>
                    {allReports && allReports.length > 0 ? (
                      allReports.map((report) => (
                        <div key={report._id} className="report-item">
                          <div className="report-header">
                            <span className={`status-badge ${getStatusBadge(report.status)}`}>
                              {report.status}
                            </span>
                            <span className="report-date">{formatDate(report.createdAt)}</span>
                          </div>
                          <div className="report-content">
                            <div className="report-info">
                              <strong>Type:</strong> {report.contentType} | 
                              <strong> Reason:</strong> {report.reason} |
                              <strong> Reporter:</strong> {report.reportedBy?.firstName} {report.reportedBy?.lastName}
                            </div>
                            <div className="report-description">
                              <strong>Description:</strong> {report.description}
                            </div>
                            {report.customReason && (
                              <div className="report-custom-reason">
                                <strong>Custom Reason:</strong> {report.customReason}
                              </div>
                            )}
                            {/* Display the actual reported content */}
                            {renderReportedContent(report)}
                            {report.actionTaken && (
                              <div className="report-action-taken">
                                <strong>Action Taken:</strong> {report.actionTaken}
                              </div>
                            )}
                            {report.reviewedAt && (
                              <div className="report-reviewed-date">
                                <strong>Reviewed:</strong> {formatDate(report.reviewedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-reports">No reports found</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Tabs.Content>
      </div>
      </Tabs.Root>
    </>
  );
};

export default Admin;