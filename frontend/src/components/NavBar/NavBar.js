import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoHome, GoCommentDiscussion,  } from 'react-icons/go';
import { GoLink } from 'react-icons/go';
import { MdEvent } from 'react-icons/md';
import { RiAdminLine } from "react-icons/ri";
import { useSelector } from 'react-redux';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('/');

  const handleNavigation = (path) => {
    setActive(path);
    navigate(path);
  };


  const userLogin = useSelector((state) => state.userLogin);
  // Destructures the relevant information
  const { loading, error, userInfo } = userLogin;
  console.log(userInfo);
  const showAdmin = userInfo.isAdmin; // Change this condition as needed

  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li
          className={`navbar-item ${active === '/home' ? 'active' : ''}`}
          onClick={() => handleNavigation('/')}
        >
          <GoHome className="navbar-icon" />
        </li>
        <li
          className={`navbar-item ${active === '/events' ? 'active' : ''}`}
          onClick={() => handleNavigation('/events')}
        >
          <MdEvent className="navbar-icon" />
        </li>
        <li
          className={`navbar-item ${active === '/chat-link' ? 'active' : ''}`}
          onClick={() => handleNavigation('/chat-link')}
        >
          <GoLink className="navbar-icon" />
        </li>
        <li
          className={`navbar-item ${active === '/discussion' ? 'active' : ''}`}
          onClick={() => handleNavigation('/discussion')}
        >
          <GoCommentDiscussion className="navbar-icon" />
        </li>
        {showAdmin && (
          <li
            className={`navbar-item ${active === '/admin' ? 'active' : ''}`}
            onClick={() => handleNavigation('/admin')}
          >
            <RiAdminLine className="navbar-icon" />
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavBar;