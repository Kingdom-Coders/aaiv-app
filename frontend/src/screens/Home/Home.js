import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/userActions";
import './Home.css';

function toggleBlur() {
  const blurredText = document.querySelector('.blur-text');
  
  blurredText.classList.toggle('revealed');
}

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  }

  return (
<div className="home-screen">
  <div className="BibleVerse">
    <p>
      <span style={{ fontWeight: 'bold' }}>daily bible verse:</span>
    </p>

    <div className="blur-container" onClick={toggleBlur}>
      <p className="blur-text">
        Why did I not perish at birth, <br />
        and die as I came from the womb?<br />
        Job 3:11
      </p>
    </div>
  </div>


      <div className="signoutButton" onClick={() => { logoutHandler(); navigate('/'); }}>
        Sign Out
      </div>

      
    </div>
    
  );
};

export default Home;