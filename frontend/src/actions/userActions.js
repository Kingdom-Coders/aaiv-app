import axios from 'axios';
import { getApiUrl } from '../config/api';
import { 
    USER_LOGIN_FAIL, 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGOUT, 
    USER_REGISTER_FAIL, 
    USER_REGISTER_LOGOUT, 
    USER_REGISTER_REQUEST, 
    USER_REGISTER_SUCCESS, 
    USER_DELETE_REQUEST, 
    USER_DELETE_FAIL, 
    USER_DELETE_SUCCESS, 
    USER_LIST_REQUEST, 
    USER_LIST_SUCCESS, 
    USER_LIST_FAIL,
    USER_UPDATE_ADMIN_REQUEST,
    USER_UPDATE_ADMIN_SUCCESS,
    USER_UPDATE_ADMIN_FAIL
} from "../constants/userConstants";

/**
 * Login user action
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };
        
        const { data } = await axios.post(
            getApiUrl("/api/users/login"),
            { email, password },
            config
        );
        
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        // Store user info in localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: 
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

/**
 * Logout user action
 */
export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
};

/**
 * Register new user action
 * @param {string} firstName - User first name
 * @param {string} lastName - User last name
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const register = (firstName, lastName, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const { data } = await axios.post(
            getApiUrl("/api/users"),
            { firstName, lastName, email, password },
            config
        );

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        // Store user info in localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

/**
 * Delete user action (Admin only)
 * @param {string} id - User ID to delete
 */
export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        };

        await axios.delete(getApiUrl(`/api/users/delete/${id}`), config);

        dispatch({ type: USER_DELETE_SUCCESS });
    } catch (error) {
        dispatch({ 
            type: USER_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

/**
 * Get all users action (Admin only)
 */
export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(getApiUrl(`/api/users/adminlist`), config);

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({
            type: USER_LIST_FAIL,
            payload: message,
        });
    }
};

/**
 * Update user admin status action (Admin only)
 * @param {string} id - User ID to update
 * @param {boolean} isAdmin - New admin status
 */
export const updateUserAdminStatus = (id, isAdmin) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_ADMIN_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(
            getApiUrl(`/api/users/${id}/admin`),
            { isAdmin },
            config
        );

        dispatch({
            type: USER_UPDATE_ADMIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch({
            type: USER_UPDATE_ADMIN_FAIL,
            payload: message,
        });
    }
};

/**
 * Delete own account action (Self-deletion)
 */
export const deleteSelfAccount = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            },
        };

        await axios.delete(getApiUrl('/api/users/me'), config);

        dispatch({ type: USER_DELETE_SUCCESS });
        
        // Log out user after successful account deletion
        localStorage.removeItem("userInfo");
        dispatch({ type: USER_LOGOUT });
    } catch (error) {
        dispatch({ 
            type: USER_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};