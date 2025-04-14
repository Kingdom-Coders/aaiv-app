import React, { useState, useMemo } from "react";
import './ChatLink.css';
import { Flex, AbsoluteCenter, Checkbox, Input, Stack, Avatar, Badge, HStack, Accordion, Box, Button, Span, Dialog, Portal, CloseButton, useFileUploadContext, Float, FileUpload, Image, Em, DialogActionTrigger } from "@chakra-ui/react";
import { useSelector } from 'react-redux';
import imgs from './settings.png'
import search from './Search.png'


const categories = [
  "Outdoorsy",
  "Studious", 
  "Social"
];

//hard code admin functionality for now
const isAdmin = true;

const ChatLink = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  console.log(userInfo);
  // const isAdmin = userInfo?.isAdmin;
  const isAdmin = true;

  const [value, setValue] = useState(["a"])
  const items = [
    { value: "a", image: "", title: "Saturday Bible Study", link:"link1", text: "Chat Description 1" },
    { value: "b", image: "", title: "Saturday Bible Study", link:"link2", text: "Chat Description 2" },
    { value: "c", image: "", title: "Saturday Bible Study", link:"link3", text: "Chat Description 3` " },
  ]  

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
      <Dialog.Root isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Title>hi</Dialog.Title>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
    </div>
  );
};
export default ChatLink;