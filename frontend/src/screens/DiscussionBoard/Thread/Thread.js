// hello world
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Thread.css";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction } from "../../../actions/postActions";
import { Button } from "@chakra-ui/react";
import { Separator, Stack, Box } from "@chakra-ui/react";
import { MdArrowBackIos, MdChatBubbleOutline } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";

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

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateFormatter = (date) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const givenDate = new Date(date);

    const postYear = givenDate.getFullYear();
    const postMonth = givenDate.getMonth() + 1;
    const postDay = givenDate.getDate();

    if (year === postYear && month === postMonth && day === postDay) {
      const diff = now - givenDate;
      const mins = diff / (1000 * 60);
      if (mins < 60) {
        return Math.floor(mins) + "m";
      } else {
        return Math.floor(diff / (1000 * 60 * 60)) + "h";
      }
    } else {
      return months[postMonth - 1] + " " + postDay;
    }
  };

  // when displayed, should have 1 as the first thread starter, then 2 as the first reply underneath
  // Then 3 next, then 4. Should look like IG comments where we don't indent after the first reply
  const threads = [
    {
      id: 1,
      postId: 3,
      user: "Jonah and Grace",
      body: "my thoughts on this verse are...",
      timestamp: "2025-04-12T08:09:00",
      replies: [
        {
          id: 1,
          user: "calvin",
          body: "word",
          replyTo: "Jonah and Grace",
          timestamp: "2025-04-14T08:09:00",
        },
        {
          id: 2,
          user: "christina",
          body: "i concur",
          replyTo: "Jonah and Grace",
          timestamp: "2025-05-10T02:11:00",
        },
        {
          id: 3,
          user: "jalenbrunsonlover",
          body: "@calvin KNICKS IN 4",
          replyTo: "calvin",
          timestamp: "2025-05-10T05:14:00",
        },
      ],
    },
    {
      id: 2,
      postId: 3,
      user: "Carson and Amy",
      body: "Our sg talked about blah blah blah today and it was very fruitful and awesome",
      timestamp: "2025-04-13T08:09:00",
      replies: [
        {
          id: 1,
          user: "chungus",
          body: "what",
          replyTo: "Carson and Amy",
          timestamp: "2025-04-24T08:09:00",
        },
        {
          id: 2,
          user: "davy",
          body: "i dont remember that",
          replyTo: "Carson and Amy",
          timestamp: "2025-05-10T01:11:00",
        },
        {
          id: 3,
          user: "tingus-pingus",
          body: "GO JETS",
          replyTo: "Carson and Amy",
          timestamp: "2025-05-10T04:14:00",
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
        {/* TODO: Post goes here */}
        {threads?.length ? (
          threads.map((thread, index) => (
            <div>
              <div className="thread">
                <Separator />
                <Box className="thread-head">
                  <div className="author">
                    {thread.user}{" "}
                    <span className="date">
                      {dateFormatter(thread.timestamp)}
                    </span>{" "}
                  </div>
                  <div className="body">{thread.body}</div>
                  <div className="buttons">
                    <Button className="thread-button" onClick={() => {}}>
                      <MdChatBubbleOutline /> Reply
                    </Button>
                    <Button className="thread-button" onClick={() => {}}>
                      <AiOutlineExclamationCircle /> Report
                    </Button>
                  </div>
                </Box>
                {thread.replies.map((reply, index) => (
                  <Box className="reply">
                    <div className="author">
                      {reply.user}{" "}
                      <span className="date">
                        {dateFormatter(reply.timestamp)}
                      </span>{" "}
                    </div>
                    <div className="body">{reply.body}</div>
                    <div className="buttons">
                      <Button className="thread-button" onClick={() => {}}>
                        <MdChatBubbleOutline /> Reply
                      </Button>
                      <Button className="thread-button" onClick={() => {}}>
                        <AiOutlineExclamationCircle /> Report
                      </Button>
                    </div>
                  </Box>
                ))}
              </div>
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
