import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserList from '../../components/UserList';
import './Admin.css';
import { 
  createAnnouncementAction, 
  listAnnouncements, 
  deleteAnnouncementAction 
} from '../../actions/announcementActions';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  
  const dispatch = useDispatch();
  
  // Get announcement states from Redux
  const announcementCreate = useSelector((state) => state.announcementCreate);
  const { loading: createLoading, error: createError, success: createSuccess } = announcementCreate;
  
  const announcementList = useSelector((state) => state.announcementList);
  const { loading: listLoading, announcements, error: listError } = announcementList;
  
  const announcementDelete = useSelector((state) => state.announcementDelete);
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = announcementDelete;

  // Load announcements when component mounts
  useEffect(() => {
    dispatch(listAnnouncements());
  }, [dispatch]);
  
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
    
    if (createError) {
      setStatusMessage({ type: 'error', text: `Error creating announcement: ${createError}` });
    }
    
    if (deleteError) {
      setStatusMessage({ type: 'error', text: `Error deleting announcement: ${deleteError}` });
    }
    
    if (listError) {
      setStatusMessage({ type: 'error', text: `Error loading announcements: ${listError}` });
    }
    
    // Clear status message after 5 seconds
    const timer = setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [createSuccess, deleteSuccess, createError, deleteError, listError, dispatch]);
  
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

  return (
    <div className="admin-screen">
      <h1 className="titleText">Admin Screen</h1>
      <UserList />
      
      {/* Status Alert */}
      {statusMessage && (
        <div className={`alert alert-${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}
      
      {/* Announcements List */}
      <div className="announcements-list">
        <h2 className="section-heading">Current Announcements</h2>
        
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
      
      {/* Create Announcement Form */}
      <div className="announcement-post">
        <div className="announcement-title">
          <h1>Create New Announcement</h1>
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
    </div>
  );
};

export default Admin;