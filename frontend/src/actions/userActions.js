import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_DELETE_REQUEST, USER_DELETE_FAIL, USER_DELETE_SUCCESS, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL } from "../constants/userConstants"
import axios from 'axios';
// Store the actual functionality of login and logout here so that our Login.js/Register.js screens can be less clunky
// Because of this we can just call dispatch(login(email, password)) and dispatch(logout()) etc in the screens

export const login = (email, password) => async(dispatch) => {
    // Dispatch keyword to call USER_LOGIN_REQUEST 
    // Eventually returns {loading : true } in reducers
    try {
        dispatch({ type: USER_LOGIN_REQUEST});

        // Makes the api request here
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
        
        // If api call is successful then dispatch keyword to call USER_LOGIN_SUCCESS
        // Returns {loading : false, userInfo: action.payload} (we send data to payload in reducers)
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data});

        // Set local storage to user info
        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
        // If api call is not successful then dispatch keyword to call USER_LOGIN_FAIL
        // Returns { loading : false, error: action.payload} (we send error response to payload in reducers)
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: 
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const logout = () => async (dispatch) => {
    localStorage.removeItem("userInfo");
    // Dispatch keyword to call USER_LOGOUT
    // Returns {}
    dispatch( {type : USER_LOGOUT});
    dispatch( {type : USER_REGISTER_LOGOUT});
};

export const register = (firstName, lastName, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST});

        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/users",
            { firstName, lastName, email, password},
            config
        );

        dispatch ( { type: USER_REGISTER_SUCCESS, payload: data});

        dispatch ( { type: USER_LOGIN_SUCCESS, payload: data });

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

// remove or delete a user (for admins only)
export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState(); // get token from state

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // token for auth
            },
        };

        await axios.delete(`/api/users/${id}`, config); // delete req

        dispatch({ type: USER_DELETE_SUCCESS });
    } catch (error){
        dispatch({ 
            type: USER_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    };
};

export const listUsers = () => async(dispatch, getState) => {
    try {
        dispatch({type: USER_LIST_REQUEST});

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/users`, config);

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const message = 
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message;
        dispatch ({
            type: USER_LIST_FAIL,
            payload: message,
        });
    };
};