import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction } from "../../../actions/postActions";

// hi

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const postCreate = useSelector((state) => state.postCreate);
  const { loading, error, post } = postCreate;

  const resetHandler = () => {
    setTitle("");
    setBody("");
  }

  const submitHandler = () => {
    if(!title || !body) return;
    dispatch(createPostAction(title, body));
    resetHandler();
    navigate("/posts");
  };

  return (
    <div className="addPostContainer">
      <h2>Create a New Post</h2>
      <div className="formContainer">
        <input
          className="formInput"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="formInput"
          type="text"
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="buttonsContainer">
        <div className="submitButton" onClick={submitHandler}>
          Submit
        </div>
        <div className="backLink">
          <span onClick={() => navigate("/posts")}>Back</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
