// hello world
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Thread.css";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction } from "../../../actions/postActions";
import { Button } from "@chakra-ui/react";
import { Separator, Stack, Text } from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { MdArrowBackIos } from "react-icons/md";

const Thread = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const postCreate = useSelector((state) => state.postCreate);
  const { loading, error, post } = postCreate;

  const resetHandler = () => {
    setTitle("");
    setBody("");
  };

  const submitHandler = () => {
    if (!title || !body) return;
    dispatch(createPostAction(title, body));
    resetHandler();
    navigate("/posts");
  };

  // Idea is to recursively build up list of replies. Still need to think about it
  // Probably need to pass in a list, or keep a global array that I just clear.
  const seekReplies = (threadPost) => {
    if (threadPost.replies.length != 0) {
      seekReplies(threadPost.replies);
    }
  };

  // when displayed, should have 1 as the first thread starter, then 2 as the first reply underneath
  // Then 3 next, then 4. Should look like IG comments where we don't indent after the first reply
  const threads = [
    {
      "thread-id": 1,
      author: "Insert Body",
      body: "thread start",
      timestamp: "2025-04-12T08:09PM",
      replies: [
        {
          "thread-id": 2,
          author: "calvin",
          body: "reply 1",
          timestamp: "2025-04-14T08:09PM",
          replies: [
            {
              "thread-id": 4,
              author: "chung",
              body: "@calvin reply 3",
              timestamp: "2025-04-14T08:14PM",
              replies: [],
            },
          ],
        },
        {
          "thread-id": 3,
          author: "davy",
          body: "reply 2",
          timestamp: "2025-04-14T08:11PM",
          replies: [],
        },
      ],
    },
  ];

  return (
    <div className="container">
      <div className="top">
        <Button
          variant="ghost"
          size="md"
          className="button"
          color="black"
          onClick={() => {
            navigate("/discussion");
          }}
        >
          <MdArrowBackIos />
        </Button>
        <h2 className="postTitle">Post Title</h2>
      </div>
      <Stack className="thread-container">
        {/* Post goes here */}
        {threads?.length ? (
          threads.reverse().map((reply, index) => (
            <div className="single-reply">
              <div className="author">{reply.author}</div>
              <Separator />
            </div>
          ))
        ) : (
          <div></div>
        )}
      </Stack>
    </div>
  );
};

export default Thread;
