import React, { useState, useMemo } from "react";
import "./ChatLink.css";
import {
  Flex,
  AbsoluteCenter,
  Avatar,
  Badge,
  HStack,
  Accordion,
  Box,
  Button,
  Span,
  Dialog,
  Portal,
  CloseButton,
  useFileUploadContext,
  Float,
  FileUpload,
  Image,
  Em,
  Input,
  Stack,
  Checkbox,
  Editable,
  IconButton,
  Menu,
  DialogActionTrigger,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import imgs from "./settings.png";
import search from "./Search.png";
import { createOverlay } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";

const categories = ["Outdoorsy", "Studious", "Social"];

const ChatLink = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const isAdmin = true; // override for now

  const [inputValue, setInputValue] = useState("");
  const [checkedItems, setCheckedItems] = useState([true, true, true]);

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCheckboxChange = (index) => (event) => {
    const updatedItems = [...checkedItems];
    updatedItems[index] = event.target.checked;
    setCheckedItems(updatedItems);
  };

  const checkBoxes = (groups, checkedItems) => {
    for (let i = 0; i < groups.length; i++) {
      if (checkedItems[categories.indexOf(groups[i])]) {
        return true;
      }
    }
    return false;
  };

  const [value, setValue] = useState(["a"]);
  const items = [
    {
      value: "a",
      image: "",
      title: "Saturday Bible Study",
      link: "link1",
      text: "Chat Description 1",
      groups: ["Social"],
    },
    {
      value: "b",
      image: "",
      title: "Tennis",
      link: "link2",
      text: "Chat Description 2",
      groups: ["Outdoorsy", "Social"],
    },
    {
      value: "c",
      image: "",
      title: "Basketball",
      link: "link3",
      text: "Chat Description 3",
      groups: ["Outdoorsy", "Social"],
    },
  ];

  const [showAddGroupCard, setShowAddGroupCard] = useState(true);

  const handleAddGroup = () => {
    setShowAddGroupCard(true);
  };

  return (
    <div className="chatlink-screen">
      <div className="chatlink-Title">
        <p>chats</p>
        <hr />
      </div>
      <div className="chatlink-SearchFilter">
        <div className="chatlink-Search">
          <img src={search} alt="Search" />
          <div className="chatlink-SearchBar">
            <Input
              placeholder="Search"
              value={inputValue}
              onChange={handleSearchChange}
              style={{ color: "#A0AEC0" }}
            />
          </div>
        </div>
        <div className="chatlink-Checkboxes">
          {categories.map((category, index) => (
            <Stack align="center" flex="1" key={category}>
              <Checkbox.Root
                defaultChecked
                colorPalette="blue"
                variant="solid"
                isChecked={checkedItems[index]}
                onChange={handleCheckboxChange(index)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label style={{ color: "black" }}>
                  {category}
                </Checkbox.Label>
              </Checkbox.Root>
            </Stack>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="chatlink-Edits">
          <Dialog.Root placement="center" size="md">
            <Dialog.Trigger asChild>
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
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content p={4}>
                  <Dialog.Header>
                    <Dialog.Title>Add Group</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body p={3}>
                    <p>Please provide the name and the link</p>
                  </Dialog.Body>
                  <Dialog.Body p={2}>
                    <Input placeholder="Title" />
                  </Dialog.Body>
                  <Dialog.Body p={2}>
                    <Input placeholder="Link" />
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button>Confirm</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </div>
      )}

      <div className="chatlink-links">
        <Stack gap="8" width="85vw">
          <Accordion.Root
            spaceY="4"
            variant="plain"
            collapsible
            defaultValue={["a"]}
          >
            {items
              .filter(
                (item) =>
                  item.title
                    .toLowerCase()
                    .includes(inputValue.toLowerCase()) &&
                  checkBoxes(item.groups, checkedItems)
              )
              .map((item, index) => (
                <Accordion.Item
                  key={index}
                  value={item.value}
                  css={{
                    boxShadow: "1px 1px 2px 1px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    overflow: "hidden",
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
                      width: "100%",
                    }}
                  >
                    <HStack width="100%" spacing="4" align="center">
                      <Avatar.Root borderRadius="10px">
                        <Avatar.Image src={item.image} />
                        <Avatar.Fallback name={item.title} />
                      </Avatar.Root>
                      <Box
                        flex="1"
                        textAlign="center"
                        fontWeight="light"
                        color="black"
                      >
                        {item.title}
                      </Box>
                      <Accordion.ItemIndicator />
                    </HStack>
                  </Accordion.ItemTrigger>
                </Accordion.Item>
              ))}
          </Accordion.Root>
        </Stack>
      </div>
    </div>
  );
};

export default ChatLink;
