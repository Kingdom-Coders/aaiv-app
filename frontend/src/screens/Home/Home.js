import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/userActions";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  }

  return (
    <div className="home-screen">
      <h1>WELCOME TO AAIV APP</h1>
      <div className="signoutButton" onClick={() => { logoutHandler(); navigate('/'); }}>
        Sign Out
      </div>
    </div>
  );
};

export default Home;