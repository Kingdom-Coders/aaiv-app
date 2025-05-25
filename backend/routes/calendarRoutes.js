require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const session = require('express-session');
const router = express.Router();

/**
 * Google OAuth2 Client Setup
 * Uses centralized credentials for all users
 */
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

/**
 * Route to initiate OAuth2 flow
 * @route GET /api/google
 * @access Public
 */
router.route('/').get((req, res) => {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
        return res.status(503).send(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;">
                <h2>🔧 Google Calendar Integration Not Available</h2>
                <p>The Google Calendar feature is currently being set up by the administrators.</p>
                <p>Please check back later or contact support for assistance.</p>
                <button onclick="window.close()" style="background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 20px;">Close</button>
            </div>
        `);
    }

    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
    ];

    try {
        const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
            prompt: 'consent',
            include_granted_scopes: true
        });
        
        console.log('Redirecting to Google OAuth:', authUrl);
        res.redirect(authUrl);
    } catch (error) {
        console.error('Error generating OAuth URL:', error);
        res.status(500).send(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;">
                <h2>❌ Authentication Error</h2>
                <p>Unable to connect to Google Calendar at this time.</p>
                <p>Error: ${error.message}</p>
                <button onclick="window.history.back()" style="background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 20px;">Go Back</button>
            </div>
        `);
    }
});

/**
 * Route for OAuth2 callback
 * @route GET /api/google/redirect
 * @access Public
 */
router.route('/redirect').get(async (req, res) => {
    const { code, error, state } = req.query;

    // Handle OAuth errors
    if (error) {
        console.error('OAuth Error:', error);
        return res.status(400).send(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;">
                <h2>❌ Authorization Failed</h2>
                <p>Google authorization was denied or failed.</p>
                <p>Error: ${error}</p>
                <button onclick="window.close()" style="background: #FF3B30; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 20px;">Close</button>
            </div>
        `);
    }

    if (!code) {
        return res.status(400).send(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;">
                <h2>❌ Authorization Code Missing</h2>
                <p>No authorization code received from Google.</p>
                <button onclick="window.history.back()" style="background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 20px;">Try Again</button>
            </div>
        `);
    }

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // Store tokens in session
        req.session.googleTokens = tokens;
        req.session.save();
        
        // Get user's calendar events
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const eventsResponse = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        
        const events = eventsResponse.data.items || [];
        
        // Generate success page with calendar
        const htmlOutput = generateSuccessPage(events);
        res.send(htmlOutput);
        
    } catch (error) {
        console.error('Error during OAuth callback:', error);
        res.status(500).send(`
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;">
                <h2>❌ Connection Failed</h2>
                <p>Failed to connect to your Google Calendar.</p>
                <p>Error: ${error.message}</p>
                <button onclick="window.history.back()" style="background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 20px;">Try Again</button>
            </div>
        `);
    }
});

/**
 * Route to check authentication status
 * @route GET /api/google/status
 * @access Public
 */
router.route('/status').get((req, res) => {
    const isAuthenticated = !!(req.session.googleTokens);
    res.json({ 
        authenticated: isAuthenticated,
        message: isAuthenticated ? 'Connected to Google Calendar' : 'Not connected to Google Calendar'
    });
});

/**
 * Route to disconnect from Google Calendar
 * @route POST /api/google/disconnect
 * @access Public
 */
router.route('/disconnect').post((req, res) => {
    req.session.googleTokens = null;
    req.session.save();
    res.json({ message: 'Disconnected from Google Calendar' });
});

/**
 * Generate success page HTML
 * @param {Array} events - Calendar events
 * @returns {string} HTML string
 */
function generateSuccessPage(events) {
    return `
            <!DOCTYPE html>
            <html>
            <head>
            <title>Google Calendar Connected</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                    .container {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    max-width: 600px;
                        width: 100%;
                    overflow: hidden;
                    }
                    
                    .header {
                    background: #34C759;
                    color: white;
                    padding: 30px;
                    text-align: center;
                    }
                    
                    .header h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                
                .header p {
                    opacity: 0.9;
                    font-size: 16px;
                    }
                    
                    .content {
                    padding: 30px;
                }
                
                .events-section h2 {
                    color: #333;
                    margin-bottom: 20px;
                        font-size: 20px;
                    }
                    
                    .event-item {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-left: 4px solid #007AFF;
                    }
                    
                    .event-title {
                        font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                    }
                    
                    .event-time {
                    color: #666;
                    font-size: 14px;
                        margin-bottom: 4px;
                    }
                    
                    .event-detail {
                    color: #888;
                        font-size: 14px;
                    }
                    
                .no-events {
                    text-align: center;
                    color: #666;
                    padding: 40px 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                }
                
                .actions {
                    margin-top: 30px;
                        text-align: center;
                }
                
                .btn {
                    display: inline-block;
                    padding: 12px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                        font-weight: 500;
                    margin: 0 10px;
                        cursor: pointer;
                        border: none;
                    font-size: 16px;
                }
                
                .btn-primary {
                    background: #007AFF;
                        color: white;
                    }
                    
                .btn-secondary {
                    background: #f1f3f4;
                    color: #333;
                }
                
                .btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                .success-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    }
                </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                    <div class="success-icon">✅</div>
                    <h1>Successfully Connected!</h1>
                    <p>Your Google Calendar is now linked to Kingdom Coders</p>
                </div>
                
                <div class="content">
                    <div class="events-section">
                        <h2>📅 Your Upcoming Events</h2>
                        ${events && events.length > 0 ? 
                            events.map(event => {
                const start = event.start.dateTime || event.start.date;
                                const startDate = new Date(start);
                                const formattedDate = startDate.toLocaleDateString();
                                const formattedTime = event.start.dateTime ? 
                                    startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                                    'All day';
                                
                                return `
                                    <div class="event-item">
                                        <div class="event-title">${event.summary || 'No title'}</div>
                                        <div class="event-time">📅 ${formattedDate} ${formattedTime}</div>
                        ${event.location ? `<div class="event-detail">📍 ${event.location}</div>` : ''}
                        ${event.description ? `<div class="event-detail">${event.description}</div>` : ''}
                                    </div>
                                `;
                            }).join('') :
                            `<div class="no-events">
                                <p>No upcoming events found.</p>
                                <p>Your calendar events will appear here once you add them!</p>
                            </div>`
                        }
                    </div>
                    
                    <div class="actions">
                        <button class="btn btn-primary" onclick="window.close()">
                            Close Window
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.reload()">
                            Refresh Events
                        </button>
                        </div>
                    </div>
                </div>
                
                <script>
                // Auto-close after 30 seconds if opened in popup
                if (window.opener) {
                            setTimeout(() => {
                        window.close();
                    }, 30000);
                }
                
                // Send success message to parent window if opened as popup
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'GOOGLE_CALENDAR_SUCCESS',
                        message: 'Google Calendar connected successfully'
                    }, '*');
                }
                    </script>
                    </body>
                    </html>
                    `;
}

module.exports = router;