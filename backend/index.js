require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const app = express();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'backend', 'tokens', 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'backend', 'credentials', 'credentials.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.SECRET_ID,
  process.env.REDIRECT
);

// Load previously authorized credentials
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

// Save new credentials
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

// List upcoming 10 events
async function listEvents(auth, res) {
  const calendar = google.calendar({ version: 'v3', auth });
  const result = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = result.data.items;
  if (!events || events.length === 0) {
    res.send('No upcoming events found.');
    return;
  }

  const output = events.map(event => {
    const start = event.start.dateTime || event.start.date;
    return `${start} - ${event.summary}`;
  });

  res.send(`<pre>${output.join('\n')}</pre>`);
}

// Start OAuth flow
app.get('/', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(url);
});

// Handle OAuth redirect
app.get('/api/calendar/redirect', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Missing code param');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    await saveCredentials(oauth2Client);
    await listEvents(oauth2Client, res);
  } catch (err) {
    console.error('Error retrieving access token', err);
    res.status(500).send('Error retrieving access token');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
