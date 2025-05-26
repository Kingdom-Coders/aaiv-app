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
 * Comment list reducer
 * Manages the state for fetching comments for a post
 */
export const commentListReducer = (state = { comments: [] }, action) => {
    switch(action.type) {
        case COMMENT_LIST_REQUEST:
            return { loading: true };
        case COMMENT_LIST_SUCCESS:
            return { loading: false, comments: action.payload };
        case COMMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

/**
 * Comment create reducer
 * Manages the state for creating new comments
 */
export const commentCreateReducer = (state = {}, action) => {
    switch(action.type) {
        case COMMENT_CREATE_REQUEST:
            return { loading: true };
        case COMMENT_CREATE_SUCCESS:
            return { loading: false, success: true, comment: action.payload };
        case COMMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

/**
 * Comment update reducer
 * Manages the state for updating comments
 */
export const commentUpdateReducer = (state = {}, action) => {
    switch(action.type) {
        case COMMENT_UPDATE_REQUEST:
            return { loading: true };
        case COMMENT_UPDATE_SUCCESS:
            return { loading: false, success: true, comment: action.payload };
        case COMMENT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

/**
 * Comment delete reducer
 * Manages the state for deleting comments
 */
export const commentDeleteReducer = (state = {}, action) => {
    switch(action.type) {
        case COMMENT_DELETE_REQUEST:
            return { loading: true };
        case COMMENT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case COMMENT_DELETE_FAIL:
            return { loading: false, error: action.payload, success: false };
        default:
            return state;
    }
}; 