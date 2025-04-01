import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { userDeleteReducer, userListReducer, userLoginReducer, userRegisterReducer } from "./reducers/userReducers";
import { postCreateReducer, postDeleteReducer, postListReducer } from "./reducers/postsReducers";

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDelete: userDeleteReducer,
    userList: userListReducer,
    postList: postListReducer,
    postCreate: postCreateReducer,
    postDelete: postDeleteReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const initialState = {
    userLogin: {userInfo: userInfoFromStorage},
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware)
);

export default store;