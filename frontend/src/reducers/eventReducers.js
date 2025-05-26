import {
    EVENT_CREATE_REQUEST,
    EVENT_CREATE_SUCCESS,
    EVENT_CREATE_FAIL,
    EVENT_CREATE_RESET,
    
    EVENT_LIST_REQUEST,
    EVENT_LIST_SUCCESS,
    EVENT_LIST_FAIL,
    
    EVENT_DETAILS_REQUEST,
    EVENT_DETAILS_SUCCESS,
    EVENT_DETAILS_FAIL,
    
    EVENT_UPDATE_REQUEST,
    EVENT_UPDATE_SUCCESS,
    EVENT_UPDATE_FAIL,
    EVENT_UPDATE_RESET,
    
    EVENT_DELETE_REQUEST,
    EVENT_DELETE_SUCCESS,
    EVENT_DELETE_FAIL,
    
    EVENT_APPROVE_REQUEST,
    EVENT_APPROVE_SUCCESS,
    EVENT_APPROVE_FAIL,
    
    EVENT_REJECT_REQUEST,
    EVENT_REJECT_SUCCESS,
    EVENT_REJECT_FAIL,
    
    EVENT_PENDING_LIST_REQUEST,
    EVENT_PENDING_LIST_SUCCESS,
    EVENT_PENDING_LIST_FAIL,
    
    EVENT_USER_LIST_REQUEST,
    EVENT_USER_LIST_SUCCESS,
    EVENT_USER_LIST_FAIL,
    
    EVENT_ADMIN_LIST_REQUEST,
    EVENT_ADMIN_LIST_SUCCESS,
    EVENT_ADMIN_LIST_FAIL,
} from '../constants/eventConstants';

// Event creation reducer
export const eventCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case EVENT_CREATE_REQUEST:
            return { loading: true };
        case EVENT_CREATE_SUCCESS:
            return { 
                loading: false, 
                success: true, 
                event: action.payload.event,
                message: action.payload.message 
            };
        case EVENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case EVENT_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

// Event list reducer (upcoming events)
export const eventListReducer = (state = { events: [] }, action) => {
    switch (action.type) {
        case EVENT_LIST_REQUEST:
            return { loading: true, events: [] };
        case EVENT_LIST_SUCCESS:
            return { 
                loading: false, 
                events: action.payload.events,
                count: action.payload.count 
            };
        case EVENT_LIST_FAIL:
            return { loading: false, error: action.payload, events: [] };
        default:
            return state;
    }
};

// Event details reducer
export const eventDetailsReducer = (state = { event: {} }, action) => {
    switch (action.type) {
        case EVENT_DETAILS_REQUEST:
            return { loading: true, ...state };
        case EVENT_DETAILS_SUCCESS:
            return { loading: false, event: action.payload };
        case EVENT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Event update reducer
export const eventUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case EVENT_UPDATE_REQUEST:
            return { loading: true };
        case EVENT_UPDATE_SUCCESS:
            return { 
                loading: false, 
                success: true, 
                event: action.payload.event,
                message: action.payload.message 
            };
        case EVENT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case EVENT_UPDATE_RESET:
            return {};
        default:
            return state;
    }
};

// Event delete reducer
export const eventDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case EVENT_DELETE_REQUEST:
            return { loading: true };
        case EVENT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case EVENT_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Event approval reducer
export const eventApproveReducer = (state = {}, action) => {
    switch (action.type) {
        case EVENT_APPROVE_REQUEST:
            return { loading: true };
        case EVENT_APPROVE_SUCCESS:
            return { 
                loading: false, 
                success: true, 
                event: action.payload.event,
                message: action.payload.message 
            };
        case EVENT_APPROVE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Event rejection reducer
export const eventRejectReducer = (state = {}, action) => {
    switch (action.type) {
        case EVENT_REJECT_REQUEST:
            return { loading: true };
        case EVENT_REJECT_SUCCESS:
            return { 
                loading: false, 
                success: true, 
                event: action.payload.event,
                message: action.payload.message 
            };
        case EVENT_REJECT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Pending events list reducer
export const eventPendingListReducer = (state = { events: [] }, action) => {
    switch (action.type) {
        case EVENT_PENDING_LIST_REQUEST:
            return { loading: true, events: [] };
        case EVENT_PENDING_LIST_SUCCESS:
            return { 
                loading: false, 
                events: action.payload.events,
                count: action.payload.count 
            };
        case EVENT_PENDING_LIST_FAIL:
            return { loading: false, error: action.payload, events: [] };
        default:
            return state;
    }
};

// User events list reducer
export const eventUserListReducer = (state = { events: [] }, action) => {
    switch (action.type) {
        case EVENT_USER_LIST_REQUEST:
            return { loading: true, events: [] };
        case EVENT_USER_LIST_SUCCESS:
            return { 
                loading: false, 
                events: action.payload.events,
                count: action.payload.count 
            };
        case EVENT_USER_LIST_FAIL:
            return { loading: false, error: action.payload, events: [] };
        default:
            return state;
    }
};

// Admin events list reducer
export const eventAdminListReducer = (state = { events: [], pagination: {} }, action) => {
    switch (action.type) {
        case EVENT_ADMIN_LIST_REQUEST:
            return { loading: true, events: [], pagination: {} };
        case EVENT_ADMIN_LIST_SUCCESS:
            return { 
                loading: false, 
                events: action.payload.events,
                pagination: action.payload.pagination 
            };
        case EVENT_ADMIN_LIST_FAIL:
            return { loading: false, error: action.payload, events: [], pagination: {} };
        default:
            return state;
    }
}; 