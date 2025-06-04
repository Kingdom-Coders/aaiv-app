import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoHome, GoCommentDiscussion, GoCalendar } from 'react-icons/go';
import { GoLink } from 'react-icons/go';
import { MdEvent } from 'react-icons/md';
import { RiAdminLine } from "react-icons/ri";
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('/');

  // Update active state based on current location
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

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
          className={`navbar-item ${active === '/home' || active === '/' ? 'active' : ''}`}
          onClick={() => handleNavigation('/home')}
        >
          <GoHome className="navbar-icon" />
        </li>
        <li
          className={`navbar-item ${active === '/events' ? 'active' : ''}`}
          onClick={() => handleNavigation('/events')}
        >
          <GoCalendar className="navbar-icon" />
        </li>
        <li
          className={`navbar-item ${active === '/chat-link' ? 'active' : ''}`}
          onClick={() => handleNavigation('/chat-link')}
        >
          <GoLink className="navbar-icon" />
        </li>
        <li
          className={`navbar-item ${active === '/discussion' || active === '/thread' || active === '/create-post' ? 'active' : ''}`}
          onClick={() => handleNavigation('/discussion')}
        >
          <GoCommentDiscussion className="navbar-icon" />
        </li>
        <li
          className={`navbar-item ${active === '/profile' ? 'active' : ''}`}
          onClick={() => handleNavigation('/profile')}
        >
          <FiUser className="navbar-icon" />
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