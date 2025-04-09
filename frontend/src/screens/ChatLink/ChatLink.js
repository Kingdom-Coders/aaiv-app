import React from 'react';
import './ChatLink.css';
import search from './Search.png'
import { Checkbox, Input, Stack } from "@chakra-ui/react"

const categories = [
  "Outdoorsy",
  "Studious", 
  "Social"
]

const ChatLink = () => {
  return (
    <div className="chatlink-screen">
      <div className="chatlink-Title">
        <p>chats</p>
        <hr /> {}
      </div>
      <div className="chatlink-SearchFilter">
        <div className = "chatlink-Search"> 
          <img src={search} alt="Search Image" />
          <div className="chatlink-SearchBar"> 
            <Input placeholder="Search" style={{color: "#A0AEC0"}}/>
          </div>
        </div>
        <div className="chatlink-Checkboxes">
          {categories.map((category) => (
          <Stack align="center" flex="1" key={category}>
            <Checkbox.Root defaultChecked colorPalette={"blue"} variant={"solid"}>
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label style={{color: "black"}}>{category}</Checkbox.Label>
            </Checkbox.Root>
          </Stack>
          ))}
        </div>
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