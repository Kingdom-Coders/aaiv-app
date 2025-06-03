import { POST_CREATE_FAIL, POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_CREATE_RESET, POST_DELETE_FAIL, POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DELETE_RESET, POST_LIST_FAIL, POST_LIST_REQUEST, POST_LIST_SUCCESS } from "../constants/postsConstants";

export const postListReducer = ( state = { posts: []}, action) => {
    switch(action.type) {
        case POST_LIST_REQUEST:
            return { loading: true };
        case POST_LIST_SUCCESS:
            return { loading: false, posts: action.payload};
        case POST_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postCreateReducer = ( state = {}, action) => {
    switch(action.type) {
        case POST_CREATE_REQUEST:
            return { loading: true };
        case POST_CREATE_SUCCESS:
            return { loading: false, success: true};
        case POST_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case POST_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const postDeleteReducer = ( state = {}, action) => {
    switch(action.type) {
        case POST_DELETE_REQUEST:
            return { loading: true };
        case POST_DELETE_SUCCESS:
            return { loading: false, success: true};
        case POST_DELETE_FAIL:
            return { loading: false, error: action.payload, success: false };
        case POST_DELETE_RESET:
            return {};
        default:
            return state;
    }
};
