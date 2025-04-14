import React, { useState, useMemo } from "react";
import './ChatLink.css';
import { AbsoluteCenter, Avatar, Badge, HStack, Accordion, Stack, Box, Button, Span, Dialog, Portal, CloseButton, useFileUploadContext, Float, FileUpload, Image, Em, DialogActionTrigger } from "@chakra-ui/react";
import { useSelector } from 'react-redux';
import imgs from './settings.png'
import search from './Search.png'
import { Checkbox, Input, Stack } from "@chakra-ui/react"

const categories = [
  "Outdoorsy",
  "Studious", 
  "Social"
]

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
      <div className="chatlink-links">
        <Stack gap="8" width="85vw">
          <Accordion.Root spaceY="4" variant="plain" collapsible defaultValue={["a"]}>
            {items.map((item, index) => (
              <Accordion.Item 
                key={index} 
                value={item.value}
                css={{
                  boxShadow: "1px 1px 2px 1px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  overflow: "hidden"
                }}
              >
                <Accordion.ItemTrigger 
                  css={{
                    padding: "10px",
                    borderRadius: "10px 10px 0 0",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%"
                  }}
                >
                  <HStack width="100%" spacing="4" align="center">
                    <Avatar.Root borderRadius="10px">
                      <Avatar.Image src={item.image} />
                      <Avatar.Fallback name={item.title} />
                    </Avatar.Root>
                    <Box flex="1" textAlign="center" fontWeight="light" color="black">{item.title}</Box>
                    <Accordion.ItemIndicator />
                    {isAdmin && (
                      <Dialog.Root placement="center" motionPreset="slide-in-bottom">
                        <Dialog.Trigger asChild>
                          <Button variant="outline" colorPalette="blue" size="sm" border="none">
                            <Image src={imgs} objectFit="contain" width="20px"></Image>
                          </Button>
                        </Dialog.Trigger>
                        <Portal>
                          <Dialog.Backdrop />
                          <Dialog.Positioner>
                            <Dialog.Content flex="1" justifyContent="center" alignItems="center" margin="10%" bg="white">
                              <Box display="flex" justifyContent="space-between" width="full" padding="2">
                                <Dialog.CloseTrigger asChild>
                                  <Button size="sm">Cancel</Button>
                                  {/* <CloseButton size="sm"/> */}
                                </Dialog.CloseTrigger>
                                <Dialog.ActionTrigger asChild>
                                  <Button size="sm">Update</Button>
                                </Dialog.ActionTrigger>
                              </Box>
                              <Dialog.Body display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                <Avatar.Root borderRadius="10px" height="150px" width="150px">
                                  <Avatar.Image src={item.image} />
                                  <Avatar.Fallback name={item.title} />
                                </Avatar.Root>
                                <Dialog.Title paddingTop="2" color="black" >Change Image</Dialog.Title>
                              </Dialog.Body>
                              <Dialog.Title color="black" textDecoration="underline" padding="2">
                                {item.title}
                              </Dialog.Title>
                              <Dialog.Footer justifyContent="space-between" width="full">
                                <Button colorPalette="gray" variant="subtle" borderRadius="20px">Edit Link</Button>
                                <Dialog.ActionTrigger asChild>
                                  <Button colorPalette="red" borderRadius="20px">Delete</Button>
                                </Dialog.ActionTrigger>
                              </Dialog.Footer>
                            </Dialog.Content>
                          </Dialog.Positioner>
                        </Portal>
                      </Dialog.Root>
                    )}
                  </HStack>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Box p="4" bg="gray.50" borderRadius="0 0 10px 10px">
                    <Box mb="2" fontWeight="medium" color="black">Description:</Box>
                    <Accordion.ItemBody color="black" fontSize="medium" marginLeft="5px" mb="3">{item.text}</Accordion.ItemBody>
                    <Box fontWeight="medium" color="black">Link:</Box>
                    <Accordion.ItemBody color="blue.500" fontSize="medium" marginLeft="5px" textDecoration="underline">
                      <Em>{item.link}</Em>
                    </Accordion.ItemBody>
                  </Box>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
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