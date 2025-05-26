import axios from "axios";
import {
    GROUP_LIST_REQUEST,
    GROUP_LIST_SUCCESS,
    GROUP_LIST_FAIL,
    GROUP_CREATE_REQUEST,
    GROUP_CREATE_SUCCESS,
    GROUP_CREATE_FAIL,
    GROUP_DETAILS_REQUEST,
    GROUP_DETAILS_SUCCESS,
    GROUP_DETAILS_FAIL,
    GROUP_UPDATE_REQUEST,
    GROUP_UPDATE_SUCCESS,
    GROUP_UPDATE_FAIL,
    GROUP_DELETE_REQUEST,
    GROUP_DELETE_SUCCESS,
    GROUP_DELETE_FAIL,
} from "../constants/groupConstants";

// Action to list all groups
export const listGroups = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: GROUP_LIST_REQUEST,
        });

        // Make API request without authentication for public access
        const { data } = await axios.get(`/api/groups`);

        dispatch({
            type: GROUP_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: GROUP_LIST_FAIL,
            payload: message,
        });
    }
};

// Action to create a new group
export const createGroupAction = (name, link, badges, description) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GROUP_CREATE_REQUEST,
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
            `/api/groups/create`,
            { name, link, badges, description },
            config
        );

        dispatch({
            type: GROUP_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: GROUP_CREATE_FAIL,
            payload: message,
        });
    }
};

// Action to get a single group by ID
export const getGroupDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GROUP_DETAILS_REQUEST,
        });

        const { data } = await axios.get(`/api/groups/${id}`);

        dispatch({
            type: GROUP_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: GROUP_DETAILS_FAIL,
            payload: message,
        });
    }
};

// Action to update a group
export const updateGroupAction = (id, name, link, badges, description) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GROUP_UPDATE_REQUEST,
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
            `/api/groups/${id}`,
            { name, link, badges, description },
            config
        );

        dispatch({
            type: GROUP_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: GROUP_UPDATE_FAIL,
            payload: message,
        });
    }
};

// Action to delete a group
export const deleteGroupAction = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GROUP_DELETE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.delete(`/api/groups/${id}`, config);

        dispatch({
            type: GROUP_DELETE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: GROUP_DELETE_FAIL,
            payload: message,
        });
    }
}; 