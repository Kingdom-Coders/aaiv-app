import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction } from "../../../actions/postActions";

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
    if(!title) return;
    dispatch(createPostAction(title, body));
    resetHandler();
    navigate("/discussion");
  };

  return (
    <div className="addPostContainer">
      <h2
        style={{margin: "24px 0", fontSize: "28px"}}
      >Create a New Post</h2>
      
      <div className="formContainer">
        <input
          className="formInput"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="formInput"
          type="text"
          placeholder="Post"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
      </div>

      <div className="buttonsContainer">
        <div className="submitButton" onClick={submitHandler}>
          Submit
        </div>
        <div className="backLink">
          <span onClick={() => navigate("/discussion")}>Back</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
