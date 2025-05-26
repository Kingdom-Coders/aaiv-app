import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

// User reducers
import { 
    userDeleteReducer, 
    userListReducer, 
    userLoginReducer, 
    userRegisterReducer 
} from "./reducers/userReducers";

// Post reducers
import { 
    postCreateReducer, 
    postDeleteReducer, 
    postListReducer 
} from "./reducers/postsReducers";

// Comment reducers
import { 
    commentListReducer,
    commentCreateReducer,
    commentUpdateReducer,
    commentDeleteReducer 
} from "./reducers/commentReducers";

// Announcement reducers
import { 
    announcementListReducer,
    announcementCreateReducer,
    announcementDetailsReducer,
    announcementUpdateReducer,
    announcementDeleteReducer 
} from "./reducers/announcementsReducers";

// Group reducers
import { 
    groupListReducer,
    groupCreateReducer,
    groupDetailsReducer,
    groupUpdateReducer,
    groupDeleteReducer 
} from "./reducers/groupReducers";

/**
 * Combine all reducers into a single root reducer
 */
const reducer = combineReducers({
    // User state
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDelete: userDeleteReducer,
    userList: userListReducer,
    
    // Post state
    postList: postListReducer,
    postCreate: postCreateReducer,
    postDelete: postDeleteReducer,
    
    // Comment state
    commentList: commentListReducer,
    commentCreate: commentCreateReducer,
    commentUpdate: commentUpdateReducer,
    commentDelete: commentDeleteReducer,
    
    // Announcement state
    announcementList: announcementListReducer,
    announcementCreate: announcementCreateReducer,
    announcementDetails: announcementDetailsReducer,
    announcementUpdate: announcementUpdateReducer,
    announcementDelete: announcementDeleteReducer,

    // Group state
    groupList: groupListReducer,
    groupCreate: groupCreateReducer,
    groupDetails: groupDetailsReducer,
    groupUpdate: groupUpdateReducer,
    groupDelete: groupDeleteReducer,
});

// Get user info from localStorage if it exists
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

// Initial state for the store
const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
};

// Middleware configuration
const middleware = [thunk];

// Create Redux store
const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware)
);

export default store;