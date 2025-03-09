import axios from "axios";
import { POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_DELETE_FAIL, POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_LIST_FAIL, POST_LIST_REQUEST, POST_LIST_SUCCESS } from "../constants/postsConstants";
import { use } from "react";

export const listPosts = () => async(dispatch, getState) => {
    try {
        dispatch({
            type: POST_LIST_REQUEST,
        });

        // Fetch userInfo from the state userLogin (using getState redux function)
        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/posts`, config);

        dispatch({
            type: POST_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch ({
            type: POST_LIST_FAIL,
            payload: message,
        });
    }
}

export const createPostAction = (title, body) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_CREATE_REQUEST,
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
            `/api/posts/create`,
            { title, body},
            config,
        );

        dispatch({
            type: POST_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({
            type: POST_CREATE_FAIL,
            payload: message,
        });
    }
};

export const deletePostAction = (id) => async(dispatch, getState) => {
    try {
        dispatch({
            type: POST_DELETE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.delete(`/api/posts/${id}`, config);

        dispatch ({
            type: POST_DELETE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({
            type: POST_DELETE_FAIL,
            payload: message,
        });
    }
};