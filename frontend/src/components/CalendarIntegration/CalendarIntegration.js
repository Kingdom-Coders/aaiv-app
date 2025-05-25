import React, { useState } from 'react';
import GoogleCalendarButton from '../GoogleCalendarButton';
import './CalendarIntegration.css';

/**
 * Calendar Integration Component
 * Example usage of GoogleCalendarButton
 */
const CalendarIntegration = () => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    /**
     * Handle successful Google Calendar connection
     */
    const handleSuccess = (successMessage) => {
        setMessage(successMessage);
        setMessageType('success');
        
        // Clear message after 5 seconds
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    /**
     * Handle Google Calendar connection errors
     */
    const handleError = (errorMessage) => {
        setMessage(errorMessage);
        setMessageType('error');
        
        // Clear message after 5 seconds
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    return (
        <div className="calendar-integration">
            <div className="calendar-header">
                <h2>📅 Calendar Integration</h2>
                <p>Connect your Google Calendar to sync events with Kingdom Coders</p>
            </div>

            {message && (
                <div className={`message ${messageType}`}>
                    {messageType === 'success' ? '✅' : '❌'} {message}
                </div>
            )}

            <div className="calendar-content">
                <div className="integration-card">
                    <div className="card-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    </div>
                    
                    <div className="card-content">
                        <h3>Google Calendar</h3>
                        <p>Sync your personal calendar events with Kingdom Coders to stay organized and never miss important meetings or deadlines.</p>
                        
                        <div className="features-list">
                            <div className="feature">
                                <span className="feature-icon">👀</span>
                                <span>View upcoming events</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">📍</span>
                                <span>See event locations</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">🔒</span>
                                <span>Secure & private</span>
                            </div>
                            <div className="feature">
                                <span className="feature-icon">📱</span>
                                <span>Mobile friendly</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-actions">
                        <GoogleCalendarButton 
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </div>
                </div>

                <div className="info-section">
                    <h4>🔐 Privacy & Security</h4>
                    <ul>
                        <li>Your calendar data is never stored on our servers</li>
                        <li>We only access events you explicitly grant permission for</li>
                        <li>You can disconnect at any time</li>
                        <li>All connections use secure OAuth 2.0 authentication</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CalendarIntegration; 