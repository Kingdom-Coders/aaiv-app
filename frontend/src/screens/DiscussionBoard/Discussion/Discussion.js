import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../actions/userActions";
import "./Discussion.css";
import { deletePostAction, listPosts } from "../../../actions/postActions";
import { BsTrash3 } from "react-icons/bs";
import { GrMore } from "react-icons/gr";
import { LuMessageSquareText } from "react-icons/lu";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { Avatar, Card } from "@chakra-ui/react";

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
        {/* <div className="signoutButton" onClick={() => { logoutHandler(); navigate('/'); }}>
        Sign Out
      </div> */}
        <div className="postsContainer">
          {posts?.length ? (
            posts.reverse().map((post) => (
              /* <div key={post._id} className="post">
                <div className="content">
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <p className="date">
                    Created On: {post.createdAt.substring(0, 10)}
                  </p>
                </div>

                <div className="buttons">
                  <div className="button reply">
                    <LuMessageSquareText />
                    <p>Reply</p>
                  </div>
                  <div
                    className="button delete"
                    onClick={() => deleteHandler(post._id)}
                  >
                  </div>
                  
                </div>
              </div> */

              <Card.Root className="post">
                <Card.Body gap="2" className="content">
                  {/* <Avatar.Root size="lg" shape="rounded">
                    <Avatar.Image src="https://picsum.photos/200/300" />
                    <Avatar.Fallback name="Nue Camp" />
                  </Avatar.Root> */}
                  <Card.Title mt="2">{post.title}</Card.Title>
                  <Card.Description>{post.body}</Card.Description>
                </Card.Body>
                <Card.Footer justifyContent="flex-end" className="buttons">
                  <Button variant="ghost" size="sm" className="button">
                    <LuMessageSquareText />
                    Reply
                  </Button>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button variant="ghost" size="sm" className="button">
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
                </Card.Footer>
              </Card.Root>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
      {/* <div className="filler"></div> */}
    </div>
  );
};

export default Discussion;
