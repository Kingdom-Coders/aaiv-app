import React from 'react';
import './ChatLink.css';


const ChatLink = () => {
  return (
    <div className="chatlink-screen">
      <div className="chatlink-Title">
        <h1>Chat Link Screen</h1>
      </div>
      <div className="chatlink-SearchFilter">
        <h1>Search Filter Section</h1>
      </div>
      <div className="chatlink-Edits">
        <h1>Edits Section</h1>
      </div>
      <div classaName = "chatlink-links">
        <h1>Links Section</h1>
      </div>
    </div>
  );
};

export default ChatLink;