require('dotenv').config();
const express = require('express');
const {google} = require('googleapis');
const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.SECRET_ID,
    process.env.REDIRECT
);

app.get('/', (req, res) => {
    console.log('hello')
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
    });
    res.redirect(url);
})

app.get('/api/calendar/redirect', (req, res) => {
    const {code} = req.query.code;
    oauth2Client.getToken(code, (err, token) => {
        if(err) {
            res.send('Error retrieving access token');
            return;
        }
        oauth2Client.setCredentials(token);
        res.send('Successfully authenticated');
    })
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
}
);