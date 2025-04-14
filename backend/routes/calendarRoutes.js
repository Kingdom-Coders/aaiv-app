require('dotenv').config();
const express = require('express');
const {google} = require('googleapis');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.SECRET_ID,
    process.env.REDIRECT
);

router.route('/').get((req, res) => {
    console.log('hello')
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
    });
    res.redirect(url);
})

router.route('/redirect').get(async (req, res) => {
    const {code} = req.query;
    oauth2Client.getToken(code, (err, token) => {
        if(err) {
            res.send('Error retrieving access token');
            return;
        }
        oauth2Client.setCredentials(token);
        res.send('Successfully authenticated');
    })
})



module.exports = router;