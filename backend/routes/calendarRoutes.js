require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const session = require('express-session');
const router = express.Router();

// --- OAuth2 Client Setup ---
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT
);

// --- Route to initiate OAuth2 flow ---
router.route('/').get((req, res) => {
    console.log('Initiating Auth - Using REDIRECT:', process.env.REDIRECT);
    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
    res.redirect(url);
});

// --- Route for OAuth2 callback (Landing Page) ---
router.route('/redirect').get(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code missing');
    }

    const reqOAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT
    );

    try {
        const { tokens } = await reqOAuth2Client.getToken(code);
        reqOAuth2Client.setCredentials(tokens);
        req.session.googleTokens = tokens;
        
        const calendar = google.calendar({ version: 'v3', auth: reqOAuth2Client });
        const listOptions = {
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        };
        const calendarResponse = await calendar.events.list(listOptions);
        const events = calendarResponse.data.items;

        const creationStatus = req.query.created;
        let message = '';
        if (creationStatus === 'success') {
            message = '<p class="message success">Event created successfully!</p>';
        } else if (creationStatus === 'error') {
            message = '<p class="message error">Failed to create event.</p>';
        }

        // --- iOS-Inspired HTML & CSS with improved date picker ---
        let htmlOutput = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Your Calendar</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-status-bar-style" content="default">
                <style>
                    /* --- iOS-Inspired Variables --- */
                    :root {
                        --ios-blue: #007AFF;
                        --ios-gray: #8E8E93;
                        --ios-light-gray: #F2F2F7;
                        --ios-green: #34C759;
                        --ios-red: #FF3B30;
                        --ios-border-radius: 10px;
                        --ios-border-color: rgba(60, 60, 67, 0.1);
                        --ios-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                        --ios-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    }
                    
                    /* --- Reset & Base Styles --- */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: var(--ios-font);
                        margin: 0;
                        padding: 0;
                        background-color: #F2F2F7;
                        color: #000;
                        line-height: 1.5;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                    
                    /* --- Layout --- */
                    .container {
                        width: 100%;
                        max-width: 100%;
                        margin: 0 auto;
                    }
                    
                    .header {
                        background-color: #fff;
                        padding: 16px;
                        border-bottom: 1px solid var(--ios-border-color);
                        position: sticky;
                        top: 0;
                        z-index: 100;
                    }
                    
                    .header h1 {
                        font-size: 20px;
                        font-weight: 600;
                        text-align: center;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .content {
                        padding: 16px;
                        max-width: 100%;
                    }
                    
                    .section {
                        margin-bottom: 24px;
                        background: #fff;
                        border-radius: var(--ios-border-radius);
                        overflow: hidden;
                        box-shadow: var(--ios-shadow);
                    }
                    
                    .section-header {
                        padding: 16px;
                        font-size: 20px;
                        font-weight: 600;
                        border-bottom: 1px solid var(--ios-border-color);
                    }
                    
                    /* --- Events List --- */
                    .events-list {
                        list-style: none;
                    }
                    
                    .event-item {
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--ios-border-color);
                        position: relative;
                    }
                    
                    .event-item:last-child {
                        border-bottom: none;
                    }
                    
                    .event-item:active {
                        background-color: var(--ios-light-gray);
                    }
                    
                    .event-title {
                        font-weight: 600;
                        font-size: 17px;
                        margin-bottom: 6px;
                    }
                    
                    .event-time {
                        font-size: 15px;
                        color: var(--ios-gray);
                        margin-bottom: 4px;
                    }
                    
                    .event-detail {
                        font-size: 15px;
                        color: var(--ios-gray);
                        margin-bottom: 4px;
                    }
                    
                    .event-icon {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background-color: var(--ios-blue);
                        position: absolute;
                        left: 4px;
                        top: 18px;
                    }
                    
                    /* --- Form --- */
                    .form-section {
                        background: #fff;
                        border-radius: var(--ios-border-radius);
                        overflow: hidden;
                        box-shadow: var(--ios-shadow);
                    }
                    
                    .form-group {
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--ios-border-color);
                    }
                    
                    .form-group:last-of-type {
                        border-bottom: none;
                    }
                    
                    label {
                        display: block;
                        font-size: 13px;
                        font-weight: 500;
                        text-transform: uppercase;
                        color: var(--ios-gray);
                        margin-bottom: 8px;
                    }
                    
                    input[type="text"],
                    textarea {
                        width: 100%;
                        padding: 12px 0;
                        border: none;
                        border-radius: 0;
                        font-size: 17px;
                        font-family: var(--ios-font);
                        background: transparent;
                        -webkit-appearance: none;
                        outline: none;
                    }
                    
                    input[type="text"]::placeholder,
                    textarea::placeholder {
                        color: #C7C7CC;
                    }
                    
                    textarea {
                        min-height: 80px;
                        resize: none;
                    }
                    
                    /* iOS-style date/time selection */
                    .date-time-field {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        padding: 12px 0;
                        font-size: 17px;
                        color: var(--ios-blue);
                        cursor: pointer;
                    }
                    
                    .date-time-display {
                        flex: 1;
                    }
                    
                    .date-time-chevron {
                        color: var(--ios-gray);
                        font-size: 14px;
                    }
                    
                    .button-container {
                        padding: 16px;
                        background-color: #F2F2F7;
                    }
                    
                    button[type="submit"] {
                        width: 100%;
                        padding: 16px;
                        background-color: var(--ios-blue);
                        color: white;
                        border: none;
                        border-radius: 14px;
                        font-size: 17px;
                        font-weight: 600;
                        text-align: center;
                        -webkit-appearance: none;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    }
                    
                    button[type="submit"]:active {
                        background-color: #0062CC;
                    }
                    
                    /* --- Messages --- */
                    .message {
                        padding: 12px 16px;
                        border-radius: var(--ios-border-radius);
                        margin-bottom: 16px;
                        font-weight: 500;
                        font-size: 15px;
                    }
                    
                    .message.success {
                        background-color: rgba(52, 199, 89, 0.1);
                        color: var(--ios-green);
                    }
                    
                    .message.error {
                        background-color: rgba(255, 59, 48, 0.1);
                        color: var(--ios-red);
                    }
                    
                    .no-events {
                        padding: 32px 16px;
                        text-align: center;
                        color: var(--ios-gray);
                        font-size: 17px;
                    }
                    
                    /* --- iOS Date Picker Modal --- */
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.4);
                        z-index: 1000;
                        display: none;
                    }
                    
                    .modal {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: #fff;
                        border-top-left-radius: 12px;
                        border-top-right-radius: 12px;
                        overflow: hidden;
                        transform: translateY(100%);
                        transition: transform 0.3s ease-out;
                        z-index: 1001;
                    }
                    
                    .modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--ios-border-color);
                    }
                    
                    .modal-cancel {
                        color: var(--ios-gray);
                        font-size: 17px;
                        background: none;
                        border: none;
                        cursor: pointer;
                    }
                    
                    .modal-title {
                        font-size: 17px;
                        font-weight: 600;
                    }
                    
                    .modal-done {
                        color: var(--ios-blue);
                        font-size: 17px;
                        font-weight: 600;
                        background: none;
                        border: none;
                        cursor: pointer;
                    }
                    
                    .modal-content {
                        padding: 20px 0;
                        max-height: 50vh;
                        overflow-y: auto;
                    }
                    
                    /* Calendar picker styles */
                    .calendar-picker {
                        padding: 0 16px;
                    }
                    
                    .calendar-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 16px;
                    }
                    
                    .calendar-month {
                        font-size: 17px;
                        font-weight: 600;
                    }
                    
                    .calendar-nav {
                        display: flex;
                        gap: 20px;
                    }
                    
                    .calendar-nav-button {
                        background: none;
                        border: none;
                        font-size: 22px;
                        color: var(--ios-blue);
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 30px;
                        height: 30px;
                    }
                    
                    .calendar-weekdays {
                        display: grid;
                        grid-template-columns: repeat(7, 1fr);
                        text-align: center;
                        font-size: 13px;
                        color: var(--ios-gray);
                        margin-bottom: 8px;
                    }
                    
                    .calendar-days {
                        display: grid;
                        grid-template-columns: repeat(7, 1fr);
                        gap: 4px;
                    }
                    
                    .calendar-day {
                        aspect-ratio: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 17px;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                    
                    .calendar-day:hover {
                        background-color: var(--ios-light-gray);
                    }
                    
                    .calendar-day.selected {
                        background-color: var(--ios-blue);
                        color: white;
                    }
                    
                    .calendar-day.other-month {
                        color: var(--ios-gray);
                        opacity: 0.5;
                    }
                    
                    .calendar-day.today {
                        font-weight: bold;
                        color: var(--ios-blue);
                    }
                    
                    /* Time picker styles */
                    .time-picker {
                        display: flex;
                        justify-content: center;
                        padding: 0 16px;
                    }
                    
                    .time-column {
                        flex: 1;
                        max-width: 120px;
                        text-align: center;
                    }
                    
                    .time-column-header {
                        font-size: 15px;
                        color: var(--ios-gray);
                        margin-bottom: 12px;
                    }
                    
                    .time-slots {
                        height: 180px;
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        scroll-snap-type: y mandatory;
                        position: relative;
                    }
                    
                    .time-slot {
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22px;
                        scroll-snap-align: center;
                    }
                    
                    .time-slot.selected {
                        color: var(--ios-blue);
                        font-weight: 500;
                    }
                    
                    .time-selector {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        right: 0;
                        height: 44px;
                        border-top: 1px solid var(--ios-border-color);
                        border-bottom: 1px solid var(--ios-border-color);
                        transform: translateY(-50%);
                        pointer-events: none;
                    }
                    
                    /* Additional styling for input fields that will be replaced with custom UI */
                    input[type="hidden"] {
                        display: none;
                    }
                    
                    /* --- Responsive Layout for Larger Screens --- */
                    @media (min-width: 768px) {
                        .container {
                            max-width: 768px;
                            margin: 0 auto;
                        }
                        
                        .content {
                            display: flex;
                            gap: 24px;
                            padding: 24px;
                        }
                        
                        .section {
                            flex: 1;
                            margin-bottom: 0;
                        }
                        
                        .form-section {
                            flex: 1;
                        }
                        
                        .modal {
                            max-width: 400px;
                            left: 50%;
                            transform: translateX(-50%) translateY(100%);
                            border-radius: 12px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Your Calendar</h1>
                </div>
                <div class="content">
                    <div class="section">
                        <div class="section-header">Upcoming Events</div>
                        ${message}
        `;

        if (events && events.length > 0) {
            htmlOutput += '<ul class="events-list">';
            events.forEach(event => {
                const start = event.start.dateTime || event.start.date;
                const formattedStart = new Date(start).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                
                htmlOutput += `
                    <li class="event-item">
                        <div class="event-icon"></div>
                        <div class="event-title">${event.summary || 'Untitled Event'}</div>
                        <div class="event-time">${formattedStart}</div>
                        ${event.location ? `<div class="event-detail">📍 ${event.location}</div>` : ''}
                        ${event.description ? `<div class="event-detail">${event.description}</div>` : ''}
                    </li>
                `;
            });
            htmlOutput += '</ul>';
        } else {
            htmlOutput += '<div class="no-events">No upcoming events</div>';
        }

        htmlOutput += `
                    </div>
                    
                    <div class="form-section">
                        <div class="section-header">Create Event</div>
                        <form action="create-event" method="POST" id="eventForm">
                            <div class="form-group">
                                <label for="summary">Title</label>
                                <input type="text" id="summary" name="summary" placeholder="Add title" required>
                            </div>
                            <div class="form-group">
                                <label for="startDate">Starts</label>
                                <div class="date-time-field" id="startDateField">
                                    <span class="date-time-display" id="startDateDisplay">Select date and time</span>
                                    <span class="date-time-chevron">›</span>
                                </div>
                                <input type="hidden" id="startDateTime" name="startDateTime" required>
                            </div>
                            <div class="form-group">
                                <label for="endDate">Ends</label>
                                <div class="date-time-field" id="endDateField">
                                    <span class="date-time-display" id="endDateDisplay">Select date and time</span>
                                    <span class="date-time-chevron">›</span>
                                </div>
                                <input type="hidden" id="endDateTime" name="endDateTime" required>
                            </div>
                            <div class="form-group">
                                <label for="location">Location</label>
                                <input type="text" id="location" name="location" placeholder="Add location">
                            </div>
                            <div class="form-group">
                                <label for="description">Notes</label>
                                <textarea id="description" name="description" placeholder="Add notes"></textarea>
                            </div>
                            <div class="button-container">
                                <button type="submit">Add to Calendar</button>
                            </div>
                        </form>
                    </div>
                </div>

                
                
                <!-- Date/Time Picker Modal -->
                <div class="modal-overlay" id="datePickerOverlay">
                    <div class="modal" id="datePickerModal">
                        <div class="modal-header">
                            <button class="modal-cancel" id="modalCancel">Cancel</button>
                            <div class="modal-title" id="modalTitle">Select Date</div>
                            <button class="modal-done" id="modalDone">Done</button>
                        </div>
                        <div class="modal-content" id="modalContent">
                            <!-- Content will be dynamically generated -->
                        </div>
                    </div>
                </div>
                
                <script>
                    // Global variables to track current state
                    let currentField = null;
                    let currentMode = 'date'; // 'date' or 'time'
                    let selectedDate = new Date();
                    let selectedHour = 12;
                    let selectedMinute = 0;
                    let selectedAmPm = 'PM';
                    
                    // Date formatting utility function
                    function formatDisplayDateTime(date, hour, minute, ampm) {
                        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        
                        const weekday = weekdays[date.getDay()];
                        const month = months[date.getMonth()];
                        const day = date.getDate();
                        
                        // Format time based on selected values
                        const formattedHour = hour.toString().padStart(2, '0');
                        const formattedMinute = minute.toString().padStart(2, '0');
                        
                        return \`\${weekday}, \${month} \${day}, \${formattedHour}:\${formattedMinute} \${ampm}\`;
                    }
                    
                    // Format for hidden input (yyyy-mm-ddThh:mm)
                    function formatISO(date, hour, minute, ampm) {
                        // Convert to 24-hour format if needed
                        let hour24 = hour;
                        if (ampm === 'PM' && hour < 12) {
                            hour24 = hour + 12;
                        } else if (ampm === 'AM' && hour === 12) {
                            hour24 = 0;
                        }
                        
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const hourStr = hour24.toString().padStart(2, '0');
                        const minuteStr = minute.toString().padStart(2, '0');
                        
                        return \`\${year}-\${month}-\${day}T\${hourStr}:\${minuteStr}\`;
                    }
                    
                    // Generate calendar UI
                    function generateCalendar(selectedDate) {
                        const today = new Date();
                        const currentMonth = selectedDate.getMonth();
                        const currentYear = selectedDate.getFullYear();
                        
                        // Get first day of month and number of days
                        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                        
                        // Get days from previous month
                        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
                        
                        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        
                        let calendarHTML = \`
                            <div class="calendar-picker">
                                <div class="calendar-header">
                                    <button class="calendar-nav-button prev-month">‹</button>
                                    <div class="calendar-month">\${monthNames[currentMonth]} \${currentYear}</div>
                                    <button class="calendar-nav-button next-month">›</button>
                                </div>
                                <div class="calendar-weekdays">
                                    <div>Sun</div>
                                    <div>Mon</div>
                                    <div>Tue</div>
                                    <div>Wed</div>
                                    <div>Thu</div>
                                    <div>Fri</div>
                                    <div>Sat</div>
                                </div>
                                <div class="calendar-days">
                        \`;
                        
                        // Add days from previous month
                        for (let i = firstDay - 1; i >= 0; i--) {
                            const day = daysInPrevMonth - i;
                            calendarHTML += \`<div class="calendar-day other-month" data-month="\${currentMonth - 1}" data-day="\${day}">\${day}</div>\`;
                        }
                        
                        // Add days for current month
                        for (let day = 1; day <= daysInMonth; day++) {
                            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                            const isSelected = day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
                            const classes = [
                                'calendar-day',
                                isToday ? 'today' : '',
                                isSelected ? 'selected' : ''
                            ].filter(Boolean).join(' ');
                            
                            calendarHTML += \`<div class="\${classes}" data-month="\${currentMonth}" data-day="\${day}">\${day}</div>\`;
                        }
                        
                        // Add days for next month
                        const totalCells = 42; // 6 weeks x 7 days
                        const daysFromCurrentMonth = firstDay + daysInMonth;
                        const remainingCells = totalCells - daysFromCurrentMonth;
                        
                        for (let day = 1; day <= remainingCells; day++) {
                            calendarHTML += \`<div class="calendar-day other-month" data-month="\${currentMonth + 1}" data-day="\${day}">\${day}</div>\`;
                        }
                        
                        calendarHTML += \`
                                </div>
                            </div>
                        \`;
                        
                        return calendarHTML;
                    }
                    
                    // Generate time picker UI
                    function generateTimePicker(selectedHour, selectedMinute, selectedAmPm) {
                        let timePickerHTML = \`
                            <div class="time-picker">
                                <div class="time-column hours">
                                    <div class="time-column-header">Hour</div>
                                    <div class="time-slots" id="hourSlots">
                                        <div class="time-selector"></div>
                        \`;
                        
                        // Hours (12-hour format)
                        for (let i = 1; i <= 12; i++) {
                            const isSelected = i === selectedHour;
                            timePickerHTML += \`<div class="time-slot \${isSelected ? 'selected' : ''}" data-value="\${i}">\${i}</div>\`;
                        }
                        
                        timePickerHTML += \`
                                    </div>
                                </div>
                                <div class="time-column minutes">
                                    <div class="time-column-header">Minute</div>
                                    <div class="time-slots" id="minuteSlots">
                                        <div class="time-selector"></div>
                        \`;
                        
                        // Minutes (increments of 5)
                        for (let i = 0; i < 60; i += 5) {
                            const isSelected = i === selectedMinute;
                            const formatted = i.toString().padStart(2, '0');
                            timePickerHTML += \`<div class="time-slot \${isSelected ? 'selected' : ''}" data-value="\${i}">\${formatted}</div>\`;
                        }
                        
                        timePickerHTML += \`
                                    </div>
                                </div>
                                <div class="time-column ampm">
                                    <div class="time-column-header">AM/PM</div>
                                    <div class="time-slots" id="ampmSlots">
                                        <div class="time-selector"></div>
                                        <div class="time-slot \${selectedAmPm === 'AM' ? 'selected' : ''}" data-value="AM">AM</div>
                                        <div class="time-slot \${selectedAmPm === 'PM' ? 'selected' : ''}" data-value="PM">PM</div>
                                    </div>
                                </div>
                            </div>
                        \`;
                        
                        return timePickerHTML;
                    }
                    
                    // Initialize date and time values
                    document.addEventListener('DOMContentLoaded', function() {
                        // Get current date/time rounded to nearest 15 minutes
                        const now = new Date();
                        now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);
                        
                        // Set default start time
                        let startDate = new Date(now);
                        let startHour = startDate.getHours();
                        let startAmPm = startHour >= 12 ? 'PM' : 'AM';
                        startHour = startHour % 12 || 12; // Convert to 12-hour format
                        let startMinute = startDate.getMinutes();
                        
                        // Set default end time (1 hour after start)
                        let endDate = new Date(startDate);
                        endDate.setHours(endDate.getHours() + 1);
                        let endHour = endDate.getHours();
                        let endAmPm = endHour >= 12 ? 'PM' : 'AM';
                        endHour = endHour % 12 || 12; // Convert to 12-hour format
                        let endMinute = endDate.getMinutes();
                        
                        // Update display and hidden fields
                        document.getElementById('startDateDisplay').textContent = formatDisplayDateTime(startDate, startHour, startMinute, startAmPm);
                        document.getElementById('endDateDisplay').textContent = formatDisplayDateTime(endDate, endHour, endMinute, endAmPm);
                        document.getElementById('startDateTime').value = formatISO(startDate, startHour, startMinute, startAmPm);
                        document.getElementById('endDateTime').value = formatISO(endDate, endHour, endMinute, endAmPm);
                        
                        // Modal elements
                        const overlay = document.getElementById('datePickerOverlay');
                        const modal = document.getElementById('datePickerModal');
                        const modalTitle = document.getElementById('modalTitle');
                        const modalContent = document.getElementById('modalContent');
                        const modalCancel = document.getElementById('modalCancel');
                        const modalDone = document.getElementById('modalDone');
                        
                        // Show modal when date fields are clicked
                        document.getElementById('startDateField').addEventListener('click', function() {
                            currentField = 'start';
                            currentMode = 'date';
                            selectedDate = startDate;
                            selectedHour = startHour;
                            selectedMinute = startMinute;
                            selectedAmPm = startAmPm;
                            
                            modalTitle.textContent = 'Start Date';
                            modalContent.innerHTML = generateCalendar(selectedDate);
                            
                            overlay.style.display = 'block';
                            setTimeout(() => {
                                modal.style.transform = 'translateY(0)';
                                if (window.innerWidth >= 768) {
                                    modal.style.transform = 'translateX(-50%) translateY(0)';
                                }
                            }, 10);
                            
                            attachCalendarListeners();
                        });
                        
                        document.getElementById('endDateField').addEventListener('click', function() {
                            currentField = 'end';
                            currentMode = 'date';
                            selectedDate = endDate;
                            selectedHour = endHour;
                            selectedMinute = endMinute;
                            selectedAmPm = endAmPm;
                            
                            modalTitle.textContent = 'End Date';
                            modalContent.innerHTML = generateCalendar(selectedDate);
                            
                            overlay.style.display = 'block';
                            setTimeout(() => {
                                modal.style.transform = 'translateY(0)';
                                if (window.innerWidth >= 768) {
                                    modal.style.transform = 'translateX(-50%) translateY(0)';
                                }
                            }, 10);
                            
                            attachCalendarListeners();
                        });
                        
                        // Modal cancel button
                        modalCancel.addEventListener('click', closeModal);
                        
                        // Modal overlay click to close
                        overlay.addEventListener('click', function(e) {
                            if (e.target === overlay) {
                                closeModal();
                            }
                        });
                        
                        // Modal done button
                        modalDone.addEventListener('click', function() {
                            if (currentMode === 'date') {
                                // Switch to time picker
                                currentMode = 'time';
                                modalTitle.textContent = currentField === 'start' ? 'Start Time' : 'End Time';
                                modalContent.innerHTML = generateTimePicker(selectedHour, selectedMinute, selectedAmPm);
                                
                                attachTimePickerListeners();
                                
                                // Scroll time slots to selected positions
                                setTimeout(() => {
                                    scrollToSelected('hourSlots', selectedHour);
                                    scrollToSelected('minuteSlots', selectedMinute);
                                    scrollToSelected('ampmSlots', selectedAmPm);
                                }, 100);
                            } else {
                                // Save the selected date and time
                                saveDateTime();
                                closeModal();
                            }
                        });
                        
                        function closeModal() {
                            modal.style.transform = 'translateY(100%)';
                            if (window.innerWidth >= 768) {
                                modal.style.transform = 'translateX(-50%) translateY(100%)';
                            }
                            
                            setTimeout(() => {
                                overlay.style.display = 'none';
                            }, 300);
                        }
                        
                        function attachCalendarListeners() {
                            // Previous month button
                            document.querySelector('.prev-month').addEventListener('click', function() {
                                selectedDate.setMonth(selectedDate.getMonth() - 1);
                                modalContent.innerHTML = generateCalendar(selectedDate);
                                attachCalendarListeners();
                            });
                            
                            // Next month button
                            document.querySelector('.next-month').addEventListener('click', function() {
                                selectedDate.setMonth(selectedDate.getMonth() + 1);
                                modalContent.innerHTML = generateCalendar(selectedDate);
                                attachCalendarListeners();
                            });
                            
                            // Day selection
                            document.querySelectorAll('.calendar-day').forEach(day => {
                                day.addEventListener('click', function() {
                                    const month = parseInt(this.getAttribute('data-month'));
                                    const day = parseInt(this.getAttribute('data-day'));
                                    
                                    selectedDate.setMonth(month);
                                    selectedDate.setDate(day);
                                    
                                    // Update calendar UI
                                    modalContent.innerHTML = generateCalendar(selectedDate);
                                    attachCalendarListeners();
                                });
                            });
                        }
                        
                        function attachTimePickerListeners() {
                            // Hour selection
                            document.querySelectorAll('#hourSlots .time-slot').forEach(slot => {
                                slot.addEventListener('click', function() {
                                    selectedHour = parseInt(this.getAttribute('data-value'));
                                    updateTimeSelection('hourSlots', selectedHour);
                                    scrollToSelected('hourSlots', selectedHour);
                                });
                            });
                            
                            // Minute selection
                            document.querySelectorAll('#minuteSlots .time-slot').forEach(slot => {
                                slot.addEventListener('click', function() {
                                    selectedMinute = parseInt(this.getAttribute('data-value'));
                                    updateTimeSelection('minuteSlots', selectedMinute);
                                    scrollToSelected('minuteSlots', selectedMinute);
                                });
                            });
                            
                            // AM/PM selection
                            document.querySelectorAll('#ampmSlots .time-slot').forEach(slot => {
                                slot.addEventListener('click', function() {
                                    selectedAmPm = this.getAttribute('data-value');
                                    updateTimeSelection('ampmSlots', selectedAmPm);
                                    scrollToSelected('ampmSlots', selectedAmPm);
                                });
                            });
                            
                            // Handle scroll snap
                            const timeColumns = ['hourSlots', 'minuteSlots', 'ampmSlots'];
                            timeColumns.forEach(id => {
                                const element = document.getElementById(id);
                                
                                element.addEventListener('scroll', debounce(function() {
                                    const slotHeight = 44; // Height of each time slot
                                    const scrollPos = this.scrollTop;
                                    const selectedIndex = Math.round(scrollPos / slotHeight);
                                    
                                    let value;
                                    if (id === 'hourSlots') {
                                        value = selectedIndex + 1; // Hours start at 1
                                        if (value > 12) value = 12;
                                        if (value < 1) value = 1;
                                        selectedHour = value;
                                    } else if (id === 'minuteSlots') {
                                        value = selectedIndex * 5; // Minutes in increments of 5
                                        if (value >= 60) value = 55;
                                        if (value < 0) value = 0;
                                        selectedMinute = value;
                                    } else if (id === 'ampmSlots') {
                                        value = selectedIndex === 0 ? 'AM' : 'PM';
                                        selectedAmPm = value;
                                    }
                                    
                                    updateTimeSelection(id, value);
                                }, 200));
                            });
                        }
                        
                        function updateTimeSelection(containerId, value) {
                            const container = document.getElementById(containerId);
                            container.querySelectorAll('.time-slot').forEach(slot => {
                                slot.classList.remove('selected');
                                if (slot.getAttribute('data-value') == value) {
                                    slot.classList.add('selected');
                                }
                            });
                        }
                        
                        function scrollToSelected(containerId, value) {
                            const container = document.getElementById(containerId);
                            const slotHeight = 44; // Height of each time slot
                            
                            let scrollPos;
                            if (containerId === 'hourSlots') {
                                scrollPos = (value - 1) * slotHeight;
                            } else if (containerId === 'minuteSlots') {
                                scrollPos = (value / 5) * slotHeight;
                            } else if (containerId === 'ampmSlots') {
                                scrollPos = (value === 'AM' ? 0 : 1) * slotHeight;
                            }
                            
                            container.scrollTo({
                                top: scrollPos,
                                behavior: 'smooth'
                            });
                        }
                        
                        function saveDateTime() {
                            // Update selected date with the time components
                            const hour24 = selectedAmPm === 'PM' && selectedHour < 12 ? selectedHour + 12 : 
                                        (selectedAmPm === 'AM' && selectedHour === 12 ? 0 : selectedHour);
                            
                            if (currentField === 'start') {
                                startDate = new Date(selectedDate);
                                startDate.setHours(hour24, selectedMinute);
                                startHour = selectedHour;
                                startMinute = selectedMinute;
                                startAmPm = selectedAmPm;
                                
                                // Update display and hidden input
                                document.getElementById('startDateDisplay').textContent = formatDisplayDateTime(startDate, startHour, startMinute, startAmPm);
                                document.getElementById('startDateTime').value = formatISO(startDate, startHour, startMinute, startAmPm);
                                
                                // Ensure end time is after start time
                                if (endDate < startDate) {
                                    endDate = new Date(startDate);
                                    endDate.setHours(endDate.getHours() + 1);
                                    endHour = endDate.getHours();
                                    endAmPm = endHour >= 12 ? 'PM' : 'AM';
                                    endHour = endHour % 12 || 12;
                                    endMinute = startMinute;
                                    
                                    document.getElementById('endDateDisplay').textContent = formatDisplayDateTime(endDate, endHour, endMinute, endAmPm);
                                    document.getElementById('endDateTime').value = formatISO(endDate, endHour, endMinute, endAmPm);
                                }
                            } else {
                                endDate = new Date(selectedDate);
                                endDate.setHours(hour24, selectedMinute);
                                endHour = selectedHour;
                                endMinute = selectedMinute;
                                endAmPm = selectedAmPm;
                                
                                // Update display and hidden input
                                document.getElementById('endDateDisplay').textContent = formatDisplayDateTime(endDate, endHour, endMinute, endAmPm);
                                document.getElementById('endDateTime').value = formatISO(endDate, endHour, endMinute, endAmPm);
                                
                                // Ensure start time is before end time
                                if (startDate > endDate) {
                                    startDate = new Date(endDate);
                                    startDate.setHours(startDate.getHours() - 1);
                                    startHour = startDate.getHours();
                                    startAmPm = startHour >= 12 ? 'PM' : 'AM';
                                    startHour = startHour % 12 || 12;
                                    startMinute = endMinute;
                                    
                                    document.getElementById('startDateDisplay').textContent = formatDisplayDateTime(startDate, startHour, startMinute, startAmPm);
                                    document.getElementById('startDateTime').value = formatISO(startDate, startHour, startMinute, startAmPm);
                                }
                            }
                        }
                        
                        // Utility function for debouncing scroll events
                        function debounce(func, wait) {
                            let timeout;
                            return function() {
                                const context = this;
                                const args = arguments;
                                clearTimeout(timeout);
                                timeout = setTimeout(() => {
                                    func.apply(context, args);
                                }, wait);
                            };
                        }
                    });
                    </script>
                    </body>
                    </html>
                    `;

                            res.send(htmlOutput);
                        } catch (error) {
                            console.error('Google Calendar Redirect Error:', error);
                            res.status(500).send(`Error accessing Google Calendar: ${error.message}`);
                        }
                    });

// --- Route to create a new calendar event ---
router.route('/create-event').post(async (req, res) => {
    const { summary, startDateTime, endDateTime, location, description } = req.body;
    const tokens = req.session.googleTokens;

    if (!tokens) {
        return res.redirect('/');
    }

    const reqOAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT
    );
    
    reqOAuth2Client.setCredentials(tokens);
    
    try {
        const calendar = google.calendar({ version: 'v3', auth: reqOAuth2Client });
        
        const event = {
            summary,
            location,
            description,
            start: {
                dateTime: new Date(startDateTime).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: new Date(endDateTime).toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };
        
        await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        
        return res.redirect('http://localhost:3000/calendar?success=Event%20created%20successfully');
    } catch (error) {
        console.error('Event Creation Error:', error);
        return res.redirect('http://localhost:3000/calendar?error=Event%20creation%20failed');
    }
});

module.exports = router;