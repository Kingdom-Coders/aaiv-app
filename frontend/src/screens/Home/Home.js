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
      <h1>Home Screen</h1>
      <div className="dailybibleverse-tab">
        <h4>Daily Bible Verse</h4>
      </div>
      <div className="upcomingevents-tab">
        <h3>Upcoming Events</h3>
      </div>
      <div className="more-tab">
        <h2>More</h2>
        <div className="links">
          <div className="insta">
            AAIV Instagram
          </div>
          <div className="markcamp">
            Sign up for Mark Camp
          </div>
        </div>
      </div>
      <div className="signoutButton" onClick={() => { logoutHandler(); navigate('/'); }}>
        Sign Out
      </div>

    </div>
  );
};

export default Home;