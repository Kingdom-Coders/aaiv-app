import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../actions/userActions";
import "./Discussion.css";
import { deletePostAction, listPosts } from "../../../actions/postActions";
import { BsTrash3 } from "react-icons/bs";
import { GrMore } from "react-icons/gr";
import { LuMessageSquareText } from "react-icons/lu";
import { Button, Menu, Portal, Card, Accordion } from "@chakra-ui/react";

const Discussion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postList = useSelector((state) => state.postList);
  const { loading, posts, error } = postList;

  const postCreate = useSelector((state) => state.postCreate);
  const { success: successCreate } = postCreate;

  const postDelete = useSelector((state) => state.postDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = postDelete;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePostAction(id));
    }
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

  const dateFinder = (date) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    let [postYear, postMonth, postDay] = date.split("-");
    postYear = parseInt(postYear);
    postMonth = parseInt(postMonth);
    postDay = parseInt(postDay);
    let result = "";
    if (year === postYear && month === postMonth && day === postDay) {
      result = "Today";
    } else {
      result = months[postMonth - 1] + " " + postDay;
    }
    return result;
  };

  useEffect(() => {
    dispatch(listPosts());
  }, [dispatch, successCreate, navigate, successDelete]);

  return (
    <div className="container">
      <h2>Posts</h2>
      <div className="buttonsContainer">
        <div
          className="signoutButton"
          onClick={() => {
            navigate("/createpost");
          }}
        >
          Create Post
        </div>
        <Accordion.Root collapsible className="postsContainer">
          {posts?.length ? (
            posts.reverse().map((post, index) => (
              <Accordion.Item key={index} value={index} className="post">
                <Accordion.ItemTrigger className="title-container">
                  <h1 className="title">
                    {post.title}{" "}
                    <span className="date">
                      {dateFinder(post.createdAt.substring(0, 10))}
                    </span>{" "}
                  </h1>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody color="black" className="content">
                    <p>{post.body}</p>
                  </Accordion.ItemBody>
                  <div className="buttons">
                    <Button variant="ghost" size="md" className="button">
                      <LuMessageSquareText />
                      Reply
                    </Button>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button variant="ghost" size="md" className="button">
                          <GrMore />
                        </Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item value="edit">Edit</Menu.Item>
                            <Menu.Item value="report">Report</Menu.Item>
                            <Menu.Item
                              value="delete"
                              color="fg.error"
                              _hover={{ bg: "bg.error", color: "fg.error" }}
                              onClick={() => deleteHandler(post._id)}
                            >
                              Delete...
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </div>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </Accordion.Root>
      </div>
    </div>
  );
};

export default Discussion;
