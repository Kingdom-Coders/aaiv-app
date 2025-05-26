import {
     USER_LOGIN_FAIL, 
     USER_LOGIN_REQUEST, 
     USER_LOGIN_SUCCESS, 
     USER_LOGOUT, 
     USER_REGISTER_FAIL, 
     USER_REGISTER_LOGOUT, 
     USER_REGISTER_REQUEST, 
     USER_REGISTER_SUCCESS,
     USER_DELETE_FAIL,
     USER_DELETE_REQUEST,
     USER_DELETE_SUCCESS,
     USER_LIST_FAIL,
     USER_LIST_REQUEST,
     USER_LIST_SUCCESS,
     USER_UPDATE_ADMIN_REQUEST,
     USER_UPDATE_ADMIN_SUCCESS,
     USER_UPDATE_ADMIN_FAIL
 } from "../constants/userConstants";
// Main purpose of reducers is to manage the state of user login
// Depending on a login state we handle what the state is updated to here

// state: current state of user login from Redux store
// action: dispatched action that contains one of these types (USER_LOGOUT, USER_LOGIN_REQUEST, etc)
export const userLoginReducer=(state={}, action) => {
    // Depending on what action we have we update the state
    switch (action.type) {
        // Case for when login request is init
        case USER_LOGIN_REQUEST:
            return { loading : true }; // Set loading to true
        // Case for when login is successful
        case USER_LOGIN_SUCCESS:
            return { loading : false, userInfo: action.payload}; // Stores user info 
        // Case for when login fails
        case USER_LOGIN_FAIL:
            return { loading : false, error: action.payload}; //Stores error message
        // Case for when the user logs out
        case USER_LOGOUT:
            return {}; // Resets state to empty
        default: 
            return state;;
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload};
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload};
        case USER_REGISTER_LOGOUT: 
            return {};
        default:
            return state;
    }
}

export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true };
        case USER_DELETE_SUCCESS:
            return { loading: false, success: true }; 
        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload }; 
        default:
            return state; 
    }
};

export const userListReducer = ( state = { users: []}, action) => {
    switch(action.type) {
        case USER_LIST_REQUEST:
            return { loading: true };
        case USER_LIST_SUCCESS:
            return { loading: false, users: action.payload};
        case USER_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userUpdateAdminReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_ADMIN_REQUEST:
            return { loading: true };
        case USER_UPDATE_ADMIN_SUCCESS:
            return { loading: false, success: true, user: action.payload }; 
        case USER_UPDATE_ADMIN_FAIL:
            return { loading: false, error: action.payload }; 
        default:
            return state; 
    }
};