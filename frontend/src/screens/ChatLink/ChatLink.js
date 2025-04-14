import React, { useState } from 'react';
import './ChatLink.css';
import search from './Search.png';
import { 
  Checkbox, 
  Input, 
  Stack, 
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Flex,
  Text,
  Heading,
  Box
} from "@chakra-ui/react";

const categories = [
  "Outdoorsy",
  "Studious", 
  "Social"
];

//hard code admin functionality for now
const isAdmin = true;

const ChatLink = () => {
  const [showAddGroupCard, setShowAddGroupCard] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);
  const [editingGroup, setEditingGroup] = useState({ title: "AAIV Nerds", image: "book" });
  
  const handleAddGroup = () => {
    setShowAddGroupCard(true);
    setShowDeleteCard(false);
  };

  const handleCancel = () => {
    setShowAddGroupCard(false);
    setShowDeleteCard(false);
  };

  const handleDelete = () => {
    setShowDeleteCard(true);
  };

  const handleConfirmDelete = () => {
    // Handle delete logic here
    setShowDeleteCard(false);
    setShowAddGroupCard(false);
  };

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

      
      {/* Admin section with Add Group button */}
      {isAdmin && (
        <div className="chatlink-Edits">
          <Flex justify="center" mt={4} mb={4}>
            <Button 
              colorPalette="blue" 
              onClick={handleAddGroup}
              size="lg"
              width="200px"
              rounded="xl"
            >
              Add Group
            </Button>
          </Flex>
        </div>
      )}
    
      {/* Group Edit Card */}
      {showAddGroupCard && (
        <div>
          
        </div>
      )}

      {/* Delete Confirmation Card */}
      {showDeleteCard && (
        <div>
          
        </div>
      )}
      
      {/* Placeholder for the chat links section */}
      <div className="chatlink-links">
        {/* This section will be implemented separately */}
      </div>
    </div>
  );
};

export default ChatLink;