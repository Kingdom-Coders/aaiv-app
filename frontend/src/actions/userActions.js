import axios from 'axios';
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
    USER_LIST_FAIL 
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
            "/api/users/login",
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
export const logout = () => async (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_REGISTER_LOGOUT });
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
            "/api/users",
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

        await axios.delete(`/api/users/delete/${id}`, config);

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

        const { data } = await axios.get(`/api/users/adminlist`, config);

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