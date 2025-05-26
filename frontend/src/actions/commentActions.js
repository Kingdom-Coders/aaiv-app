import axios from "axios";
import { 
    COMMENT_LIST_REQUEST, 
    COMMENT_LIST_SUCCESS, 
    COMMENT_LIST_FAIL,
    COMMENT_CREATE_REQUEST,
    COMMENT_CREATE_SUCCESS,
    COMMENT_CREATE_FAIL,
    COMMENT_UPDATE_REQUEST,
    COMMENT_UPDATE_SUCCESS,
    COMMENT_UPDATE_FAIL,
    COMMENT_DELETE_REQUEST,
    COMMENT_DELETE_SUCCESS,
    COMMENT_DELETE_FAIL
} from "../constants/commentConstants";

/**
 * Get all comments for a specific post
 * @param {string} postId - The ID of the post to get comments for
 */
export const listComments = (postId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COMMENT_LIST_REQUEST,
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

        const { data } = await axios.get(`/api/comments/${postId}`, config);

        dispatch({
            type: COMMENT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch ({
            type: COMMENT_LIST_FAIL,
            payload: message,
        });
    }
};

/**
 * Create a new comment
 * @param {string} postId - The ID of the post to comment on
 * @param {string} body - The comment content
 * @param {string} parentCommentId - Optional parent comment ID for replies
 */
export const createCommentAction = (postId, body, parentCommentId = null) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COMMENT_CREATE_REQUEST,
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
            `/api/comments`,
            { postId, body, parentCommentId },
            config,
        );

        dispatch({
            type: COMMENT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({
            type: COMMENT_CREATE_FAIL,
            payload: message,
        });
    }
};

/**
 * Update a comment
 * @param {string} commentId - The ID of the comment to update
 * @param {string} body - The updated comment content
 */
export const updateCommentAction = (commentId, body) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COMMENT_UPDATE_REQUEST,
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
            `/api/comments/single/${commentId}`,
            { body },
            config,
        );

        dispatch({
            type: COMMENT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({
            type: COMMENT_UPDATE_FAIL,
            payload: message,
        });
    }
};

/**
 * Delete a comment
 * @param {string} commentId - The ID of the comment to delete
 */
export const deleteCommentAction = (commentId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COMMENT_DELETE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.delete(`/api/comments/single/${commentId}`, config);

        dispatch ({
            type: COMMENT_DELETE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({
            type: COMMENT_DELETE_FAIL,
            payload: message,
        });
    }
}; 