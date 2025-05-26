import {
    EVENT_CREATE_REQUEST,
    EVENT_CREATE_SUCCESS,
    EVENT_CREATE_FAIL,
    EVENT_CREATE_RESET,
    
    EVENT_LIST_REQUEST,
    EVENT_LIST_SUCCESS,
    EVENT_LIST_FAIL,
    
    EVENT_DETAILS_REQUEST,
    EVENT_DETAILS_SUCCESS,
    EVENT_DETAILS_FAIL,
    
    EVENT_UPDATE_REQUEST,
    EVENT_UPDATE_SUCCESS,
    EVENT_UPDATE_FAIL,
    EVENT_UPDATE_RESET,
    
    EVENT_DELETE_REQUEST,
    EVENT_DELETE_SUCCESS,
    EVENT_DELETE_FAIL,
    
    EVENT_APPROVE_REQUEST,
    EVENT_APPROVE_SUCCESS,
    EVENT_APPROVE_FAIL,
    
    EVENT_REJECT_REQUEST,
    EVENT_REJECT_SUCCESS,
    EVENT_REJECT_FAIL,
    
    EVENT_PENDING_LIST_REQUEST,
    EVENT_PENDING_LIST_SUCCESS,
    EVENT_PENDING_LIST_FAIL,
    
    EVENT_USER_LIST_REQUEST,
    EVENT_USER_LIST_SUCCESS,
    EVENT_USER_LIST_FAIL,
    
    EVENT_ADMIN_LIST_REQUEST,
    EVENT_ADMIN_LIST_SUCCESS,
    EVENT_ADMIN_LIST_FAIL,
} from '../constants/eventConstants';

import axios from 'axios';
import { getApiUrl } from '../config/api';

// Create a new event
export const createEvent = (eventData) => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(getApiUrl('/api/events'), eventData, config);

        dispatch({
            type: EVENT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Reset event create state
export const resetEventCreate = () => (dispatch) => {
    dispatch({ type: EVENT_CREATE_RESET });
};

// Get upcoming events (public)
export const listEvents = () => async (dispatch) => {
    try {
        dispatch({ type: EVENT_LIST_REQUEST });

        const { data } = await axios.get(getApiUrl('/api/events'));

        dispatch({
            type: EVENT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Get event details
export const getEventDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: EVENT_DETAILS_REQUEST });

        const { data } = await axios.get(getApiUrl(`/api/events/${id}`));

        dispatch({
            type: EVENT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Update an event
export const updateEvent = (id, eventData) => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_UPDATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(getApiUrl(`/api/events/${id}`), eventData, config);

        dispatch({
            type: EVENT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Reset update event state
export const resetEventUpdate = () => (dispatch) => {
    dispatch({ type: EVENT_UPDATE_RESET });
};

// Delete an event
export const deleteEvent = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_DELETE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(getApiUrl(`/api/events/${id}`), config);

        dispatch({
            type: EVENT_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: EVENT_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Approve an event
export const approveEvent = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_APPROVE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(getApiUrl(`/api/events/${id}/approve`), {}, config);

        dispatch({
            type: EVENT_APPROVE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_APPROVE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Reject an event
export const rejectEvent = (id, reason) => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_REJECT_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(getApiUrl(`/api/events/${id}/reject`), { reason }, config);

        dispatch({
            type: EVENT_REJECT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_REJECT_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Get pending events for admin review
export const listPendingEvents = () => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_PENDING_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(getApiUrl('/api/events/pending'), config);

        dispatch({
            type: EVENT_PENDING_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_PENDING_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Get user's events
export const listUserEvents = () => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_USER_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(getApiUrl('/api/events/my-events'), config);

        dispatch({
            type: EVENT_USER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_USER_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Get all events for admin
export const listAdminEvents = () => async (dispatch, getState) => {
    try {
        dispatch({ type: EVENT_ADMIN_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(getApiUrl('/api/events/admin'), config);

        dispatch({
            type: EVENT_ADMIN_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: EVENT_ADMIN_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
}; 