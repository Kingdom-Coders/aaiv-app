import axios from "axios";
import {
    ANNOUNCEMENT_LIST_REQUEST,
    ANNOUNCEMENT_LIST_SUCCESS,
    ANNOUNCEMENT_LIST_FAIL,
    ANNOUNCEMENT_CREATE_REQUEST,
    ANNOUNCEMENT_CREATE_SUCCESS,
    ANNOUNCEMENT_CREATE_FAIL,
    ANNOUNCEMENT_DETAILS_REQUEST,
    ANNOUNCEMENT_DETAILS_SUCCESS,
    ANNOUNCEMENT_DETAILS_FAIL,
    ANNOUNCEMENT_UPDATE_REQUEST,
    ANNOUNCEMENT_UPDATE_SUCCESS,
    ANNOUNCEMENT_UPDATE_FAIL,
    ANNOUNCEMENT_DELETE_REQUEST,
    ANNOUNCEMENT_DELETE_SUCCESS,
    ANNOUNCEMENT_DELETE_FAIL,
} from "../constants/announcementsConstants";

// Action to list all announcements
export const listAnnouncements = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ANNOUNCEMENT_LIST_REQUEST,
        });

        // Make API request without authentication for public access
        const { data } = await axios.get(`/api/announcements`);

        dispatch({
            type: ANNOUNCEMENT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: ANNOUNCEMENT_LIST_FAIL,
            payload: message,
        });
    }
};

// Action to create a new announcement
export const createAnnouncementAction = (title, body) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ANNOUNCEMENT_CREATE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(
            `/api/announcements/create`,
            { title, body },
            config
        );

        dispatch({
            type: ANNOUNCEMENT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: ANNOUNCEMENT_CREATE_FAIL,
            payload: message,
        });
    }
};

// Action to get a single announcement by ID
export const getAnnouncementDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ANNOUNCEMENT_DETAILS_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/announcements/${id}`, config);

        dispatch({
            type: ANNOUNCEMENT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: ANNOUNCEMENT_DETAILS_FAIL,
            payload: message,
        });
    }
};

// Action to update an announcement
export const updateAnnouncementAction = (id, title, body) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ANNOUNCEMENT_UPDATE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(
            `/api/announcements/${id}`,
            { title, body },
            config
        );

        dispatch({
            type: ANNOUNCEMENT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: ANNOUNCEMENT_UPDATE_FAIL,
            payload: message,
        });
    }
};

// Action to delete an announcement
export const deleteAnnouncementAction = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ANNOUNCEMENT_DELETE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.delete(`/api/announcements/${id}`, config);

        dispatch({
            type: ANNOUNCEMENT_DELETE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: ANNOUNCEMENT_DELETE_FAIL,
            payload: message,
        });
    }
};