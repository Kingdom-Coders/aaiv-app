import React, { useState, useMemo } from "react";
import './ChatLink.css';
import { AbsoluteCenter, Avatar, Badge, HStack, Accordion, Stack, Box, Button, Span, Dialog, Portal, CloseButton, useFileUploadContext, Float, FileUpload, Image, Em } from "@chakra-ui/react";
import { useSelector } from 'react-redux';
import imgs from './settings.png'

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
      <div className = "chatlink-links">
        <Stack gap="8" width="85vw">
          <Accordion.Root spaceY="4" variant="plain" collapsible defaultValue={["a"]}>
          {items.map((item, index) => (
            <Accordion.Item key={index} value={item.value}>
              <Box position="relative" borderRadius="10px" shadow=" 1px 1px 2px 1px rgba(0, 0, 0, 0.2)" padding="2px">
                <Accordion.ItemTrigger>
                  <Avatar.Root borderRadius="10px" marginLeft="10px">
                    <Avatar.Image src={item.image} />
                    <Avatar.Fallback name={item.title} />
                  </Avatar.Root>
                  <HStack flex="1" justify="center" fontWeight="light" color="black">{item.title}</HStack>
                  
                <Accordion.ItemIndicator />
                {isAdmin && (
                    <Dialog.Root placement="center" motionPreset="slide-in-bottom">
                      <Dialog.Trigger asChild>
                        {/* <AbsoluteCenter axis="vertical" insetEnd="2"> */}
                        <Button variant="outline" colorPalette="blue" size="sm" border="none">
                          <Image src={imgs} objectFit="contain" width="20px"></Image>
                        </Button>
                        {/* </AbsoluteCenter> */}
                      </Dialog.Trigger>
                      <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                          <Dialog.Content flex="1" justifyContent="center" alignItems="center" margin="10%" bg="white">
                            <Dialog.CloseTrigger asChild>
                              <CloseButton size="sm"/>
                            </Dialog.CloseTrigger>
                            <Dialog.Header>
                              <Dialog.Title color="black" >Edit Image</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                              <Avatar.Root borderRadius="10px" height="150px" width="150px">
                                <Avatar.Image src={item.image} />
                                <Avatar.Fallback name={item.title} />
                              </Avatar.Root>
                            </Dialog.Body>
                            <Dialog.Title color="black" textDecoration="underline" padding="10px">
                              {item.title}
                            </Dialog.Title>
                          <Dialog.Footer>
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
                </Accordion.ItemTrigger>
              </Box>
              <Accordion.ItemContent>
                <Accordion.ItemBody color="black" fontSize="small" marginLeft="5px">{item.text}</Accordion.ItemBody>
                <Accordion.ItemBody color="black" fontSize="small" marginLeft="5px" textDecoration="underline"><Em>{item.link}</Em></Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      </div>
    </div>
  );
};
export default ChatLink;
