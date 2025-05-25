import React, { useState, useEffect } from 'react';
import './GoogleCalendarButton.css';

/**
 * Google Calendar Integration Button
 * Handles OAuth flow and connection status
 */
const GoogleCalendarButton = ({ onSuccess, onError, className = '' }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Check connection status on component mount
    useEffect(() => {
        checkConnectionStatus();
    }, []);

    /**
     * Check if user is already connected to Google Calendar
     */
    const checkConnectionStatus = async () => {
        try {
            const response = await fetch('/api/google/status');
            const data = await response.json();
            setIsConnected(data.authenticated);
        } catch (error) {
            console.error('Error checking Google Calendar status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    /**
     * Handle Google Calendar login
     */
    const handleGoogleLogin = () => {
        setIsLoading(true);
        
        // Open Google OAuth in a popup window
        const popup = window.open(
            '/api/google',
            'google-calendar-auth',
            'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for messages from the popup
        const messageListener = (event) => {
            if (event.data.type === 'GOOGLE_CALENDAR_SUCCESS') {
                setIsConnected(true);
                setIsLoading(false);
                popup.close();
                
                if (onSuccess) {
                    onSuccess(event.data.message);
                }
                
                // Clean up listener
                window.removeEventListener('message', messageListener);
            }
        };

        window.addEventListener('message', messageListener);

        // Check if popup was closed manually
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                setIsLoading(false);
                clearInterval(checkClosed);
                window.removeEventListener('message', messageListener);
                
                // Check status again in case user completed auth
                setTimeout(checkConnectionStatus, 1000);
            }
        }, 1000);
    };

    /**
     * Handle disconnecting from Google Calendar
     */
    const handleDisconnect = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/google/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsConnected(false);
                if (onSuccess) {
                    onSuccess('Disconnected from Google Calendar');
                }
            } else {
                throw new Error('Failed to disconnect');
            }
        } catch (error) {
            console.error('Error disconnecting from Google Calendar:', error);
            if (onError) {
                onError('Failed to disconnect from Google Calendar');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <button className={`google-calendar-btn loading ${className}`} disabled>
                <span className="spinner"></span>
                Checking connection...
            </button>
        );
    }

    if (isConnected) {
        return (
            <div className={`google-calendar-connected ${className}`}>
                <div className="connection-status">
                    <span className="status-icon">✅</span>
                    <span className="status-text">Google Calendar Connected</span>
                </div>
                <button 
                    className="disconnect-btn"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                >
                    {isLoading ? 'Disconnecting...' : 'Disconnect'}
                </button>
            </div>
        );
    }

    return (
        <button 
            className={`google-calendar-btn ${className}`}
            onClick={handleGoogleLogin}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <span className="spinner"></span>
                    Connecting...
                </>
            ) : (
                <>
                    <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Connect Google Calendar
                </>
            )}
        </button>
    );
};

export default GoogleCalendarButton; 