import {
    GROUP_LIST_REQUEST,
    GROUP_LIST_SUCCESS,
    GROUP_LIST_FAIL,
    GROUP_CREATE_REQUEST,
    GROUP_CREATE_SUCCESS,
    GROUP_CREATE_FAIL,
    GROUP_CREATE_RESET,
    GROUP_DETAILS_REQUEST,
    GROUP_DETAILS_SUCCESS,
    GROUP_DETAILS_FAIL,
    GROUP_UPDATE_REQUEST,
    GROUP_UPDATE_SUCCESS,
    GROUP_UPDATE_FAIL,
    GROUP_UPDATE_RESET,
    GROUP_DELETE_REQUEST,
    GROUP_DELETE_SUCCESS,
    GROUP_DELETE_FAIL,
} from "../constants/groupConstants";

// Group list reducer
export const groupListReducer = (state = { groups: [] }, action) => {
    switch (action.type) {
        case GROUP_LIST_REQUEST:
            return { loading: true, groups: [] };
        case GROUP_LIST_SUCCESS:
            return { loading: false, groups: action.payload };
        case GROUP_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Group create reducer
export const groupCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_CREATE_REQUEST:
            return { loading: true };
        case GROUP_CREATE_SUCCESS:
            return { loading: false, success: true, group: action.payload };
        case GROUP_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case GROUP_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

// Group details reducer
export const groupDetailsReducer = (state = { group: {} }, action) => {
    switch (action.type) {
        case GROUP_DETAILS_REQUEST:
            return { loading: true, ...state };
        case GROUP_DETAILS_SUCCESS:
            return { loading: false, group: action.payload };
        case GROUP_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Group update reducer
export const groupUpdateReducer = (state = { group: {} }, action) => {
    switch (action.type) {
        case GROUP_UPDATE_REQUEST:
            return { loading: true };
        case GROUP_UPDATE_SUCCESS:
            return { loading: false, success: true, group: action.payload };
        case GROUP_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case GROUP_UPDATE_RESET:
            return { group: {} };
        default:
            return state;
    }
};

// Group delete reducer
export const groupDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case GROUP_DELETE_REQUEST:
            return { loading: true };
        case GROUP_DELETE_SUCCESS:
            return { loading: false, success: true };
        case GROUP_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}; 