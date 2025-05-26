// API Configuration
const API_CONFIG = {
  // Base URL configuration based on environment
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://aaiv-app.onrender.com' 
    : 'http://localhost:5001',
    
  // API endpoints
  ENDPOINTS: {
    // User endpoints
    LOGIN: '/api/users/login',
    REGISTER: '/api/users',
    DELETE_USER: '/api/users/delete',
    LIST_USERS: '/api/users/adminlist',
    UPDATE_USER_ADMIN: '/api/users',
    
    // Post endpoints
    POSTS: '/api/posts',
    CREATE_POST: '/api/posts/create',
    
    // Comment endpoints
    COMMENTS: '/api/comments',
    
    // Announcement endpoints
    ANNOUNCEMENTS: '/api/announcements',
    CREATE_ANNOUNCEMENT: '/api/announcements/create',
    
    // Group endpoints
    GROUPS: '/api/groups',
    
    // Event endpoints
    EVENTS: '/api/events',
    EVENTS_PENDING: '/api/events/pending',
    EVENTS_MY: '/api/events/my-events',
    EVENTS_ADMIN: '/api/events/admin',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export the configuration
export default API_CONFIG; 