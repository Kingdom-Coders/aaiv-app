import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../actions/userActions";
import "./Discussion.css";
import { deletePostAction, listPosts } from "../../../actions/postActions";

const Discussion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postList = useSelector(state => state.postList);
  const { loading, posts, error } = postList;

  const postCreate = useSelector((state) => state.postCreate);
  const { success: successCreate } = postCreate;

  const postDelete = useSelector((state) => state.postDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = postDelete

  const logoutHandler = () => {
    dispatch(logout());
  }

  const deleteHandler = (id) => {
    if(window.confirm("Are you sure?")) {
        dispatch(deletePostAction(id));
    }
  }

  useEffect(() => {
    dispatch(listPosts());
  }, [dispatch, successCreate, navigate, successDelete])

  return (
    <div className="container">
      <h2>Posts</h2>
      <div className="buttonsContainer">
      <div className="signoutButton" onClick={() => {navigate('/createpost')}}>
        Create Post
      </div>
      <div className="signoutButton" onClick={() => { logoutHandler(); navigate('/'); }}>
        Sign Out
      </div>
      <div className="postsContainer">
        {posts?.length ? (
            posts.reverse().map((post) => (
            <div key={post._id} className="post">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <p className="date">Created On: {post.createdAt.substring(0, 10)}</p>
                <div
                className="deleteButton"
                onClick={() => deleteHandler(post._id)}
              >
                X
              </div>
            </div>
            ))
        ) : (
            <p>No posts found.</p>
        )}
       </div>
    </div>
    </div>
  );
};

export default Discussion;
