import {
    REPORT_CREATE_REQUEST,
    REPORT_CREATE_SUCCESS,
    REPORT_CREATE_FAIL,
    REPORT_CREATE_RESET,
    REPORT_LIST_REQUEST,
    REPORT_LIST_SUCCESS,
    REPORT_LIST_FAIL,
    REPORT_PENDING_REQUEST,
    REPORT_PENDING_SUCCESS,
    REPORT_PENDING_FAIL,
    REPORT_REVIEW_REQUEST,
    REPORT_REVIEW_SUCCESS,
    REPORT_REVIEW_FAIL,
    REPORT_DISMISS_REQUEST,
    REPORT_DISMISS_SUCCESS,
    REPORT_DISMISS_FAIL,
} from '../actions/reportActions';

// Report create reducer
export const reportCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case REPORT_CREATE_REQUEST:
            return { loading: true };
        case REPORT_CREATE_SUCCESS:
            return { loading: false, success: true, report: action.payload };
        case REPORT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case REPORT_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

// Report list reducer
export const reportListReducer = (state = { reports: [] }, action) => {
    switch (action.type) {
        case REPORT_LIST_REQUEST:
            return { loading: true, reports: [] };
        case REPORT_LIST_SUCCESS:
            return { loading: false, reports: action.payload };
        case REPORT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Pending reports reducer
export const reportPendingReducer = (state = { reports: [] }, action) => {
    switch (action.type) {
        case REPORT_PENDING_REQUEST:
            return { loading: true, reports: [] };
        case REPORT_PENDING_SUCCESS:
            return { loading: false, reports: action.payload };
        case REPORT_PENDING_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Report review reducer
export const reportReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case REPORT_REVIEW_REQUEST:
            return { loading: true };
        case REPORT_REVIEW_SUCCESS:
            return { loading: false, success: true, report: action.payload };
        case REPORT_REVIEW_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Report dismiss reducer
export const reportDismissReducer = (state = {}, action) => {
    switch (action.type) {
        case REPORT_DISMISS_REQUEST:
            return { loading: true };
        case REPORT_DISMISS_SUCCESS:
            return { loading: false, success: true, report: action.payload };
        case REPORT_DISMISS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}; 