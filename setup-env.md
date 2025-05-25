# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/your_database_name

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=5001
NODE_ENV=development

# Session Secret (generate a random string)
SESSION_SECRET=your_random_session_secret_here

# Google OAuth Configuration (ADMIN SETUP ONLY)
# These are set up once by administrators for all users
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5001/api/google/redirect
```

## For Regular Users

**Good news!** If you're a regular user, you don't need to set up Google OAuth credentials. The administrators have already configured this for everyone.

Simply:
1. Make sure your `.env` file has the basic variables (database, JWT, session)
2. Click the "Login with Google Calendar" button
3. Authorize the Kingdom Coders app to access your calendar
4. You're done! ✅

## For Administrators Only

### Setting Up Google OAuth for All Users

#### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project called "Kingdom Coders AAIV App"
3. Enable Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

#### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "Kingdom Coders AAIV App"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar.readonly`
   - `https://www.googleapis.com/auth/calendar.events`
5. Add test users (optional for development)

#### 3. Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5001/api/google/redirect`
   - `https://yourdomain.com/api/google/redirect` (for production)

#### 4. Update Environment Variables
Add these to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_from_google
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google
GOOGLE_REDIRECT_URI=http://localhost:5001/api/google/redirect
```

#### 5. Deploy for Production
For production deployment:
1. Update `GOOGLE_REDIRECT_URI` to your production domain
2. Add the production redirect URI to Google Cloud Console
3. Set `NODE_ENV=production`

## How It Works

### User Experience
1. User clicks "Login with Google Calendar"
2. Redirected to Google's authorization page
3. User grants permission to Kingdom Coders app
4. Redirected back with a beautiful success page
5. User's calendar is now connected!

### Technical Flow
1. App uses centralized Google OAuth credentials
2. Each user authorizes the app to access their personal calendar
3. User tokens are stored in their session
4. App can read/write to user's calendar on their behalf

## Troubleshooting

### For Users
**"Google Calendar Integration Not Available"**
- The administrators haven't set up Google OAuth yet
- Contact support or wait for setup completion

**"Authorization Failed"**
- Try clearing your browser cookies and try again
- Make sure you're using a Google account
- Contact support if the issue persists

### For Administrators
**"Missing required parameter: redirect_uri"**
- Check that all three Google environment variables are set
- Verify `GOOGLE_REDIRECT_URI` matches Google Cloud Console exactly
- Restart the server after updating `.env`

**"OAuth consent screen not configured"**
- Complete the OAuth consent screen setup in Google Cloud Console
- Make sure the app is not in "Testing" mode for production use

**"Invalid client"**
- Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure credentials are from the correct Google Cloud project 