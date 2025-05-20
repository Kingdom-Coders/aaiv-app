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

// Reducer for handling list of announcements
export const announcementListReducer = (state = { announcements: [] }, action) => {
    switch (action.type) {
        case ANNOUNCEMENT_LIST_REQUEST:
            return { loading: true };
        case ANNOUNCEMENT_LIST_SUCCESS:
            return { loading: false, announcements: action.payload };
        case ANNOUNCEMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Reducer for creating a new announcement
export const announcementCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ANNOUNCEMENT_CREATE_REQUEST:
            return { loading: true };
        case ANNOUNCEMENT_CREATE_SUCCESS:
            return { loading: false, success: true, announcement: action.payload };
        case ANNOUNCEMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Reducer for handling a single announcement's details
export const announcementDetailsReducer = (state = { announcement: {} }, action) => {
    switch (action.type) {
        case ANNOUNCEMENT_DETAILS_REQUEST:
            return { loading: true };
        case ANNOUNCEMENT_DETAILS_SUCCESS:
            return { loading: false, announcement: action.payload };
        case ANNOUNCEMENT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Reducer for updating an announcement
export const announcementUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case ANNOUNCEMENT_UPDATE_REQUEST:
            return { loading: true };
        case ANNOUNCEMENT_UPDATE_SUCCESS:
            return { loading: false, success: true, announcement: action.payload };
        case ANNOUNCEMENT_UPDATE_FAIL:
            return { loading: false, error: action.payload, success: false };
        default:
            return state;
    }
};

// Reducer for deleting an announcement
export const announcementDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ANNOUNCEMENT_DELETE_REQUEST:
            return { loading: true };
        case ANNOUNCEMENT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case ANNOUNCEMENT_DELETE_FAIL:
            return { loading: false, error: action.payload, success: false };
        default:
            return state;
    }
};