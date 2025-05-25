import React, { useState } from "react";
import "./ChatLink.css";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Heading,
  Accordion,
  Avatar,
  Checkbox,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { LuSearch } from "react-icons/lu";

const categories = ["Outdoorsy", "Studious", "Social"];

const ChatLink = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const isAdmin = true; // override for now

  const [inputValue, setInputValue] = useState("");
  const [checkedItems, setCheckedItems] = useState([true, true, true]);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newGroupLink, setNewGroupLink] = useState("");

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const checkBoxes = (groups, checkedItems) => {
    for (let i = 0; i < groups.length; i++) {
      if (checkedItems[categories.indexOf(groups[i])]) {
        return true;
      }
    }
    return false;
  };

  const [items, setItems] = useState([
    {
      value: "a",
      image: "",
      title: "Saturday Bible Study",
      link: "https://discord.gg/biblestudy",
      text: "Join us for weekly Bible study and fellowship",
      groups: ["Social"],
    },
    {
      value: "b",
      image: "",
      title: "Tennis",
      link: "https://discord.gg/tennis",
      text: "Tennis enthusiasts welcome! All skill levels",
      groups: ["Outdoorsy", "Social"],
    },
    {
      value: "c",
      image: "",
      title: "Basketball",
      link: "https://discord.gg/basketball",
      text: "Weekly basketball games and tournaments",
      groups: ["Outdoorsy", "Social"],
    },
  ]);

  const handleAddGroup = () => {
    if (newGroupTitle.trim() && newGroupLink.trim()) {
      const newItem = {
        value: `item_${Date.now()}`,
        image: "",
        title: newGroupTitle,
        link: newGroupLink,
        text: `Join our ${newGroupTitle} community`,
        groups: ["Social"], // Default group
      };
      setItems([...items, newItem]);
      setNewGroupTitle("");
      setNewGroupLink("");
    }
  };

  const handleJoinGroup = (link) => {
    window.open(link, '_blank');
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(inputValue.toLowerCase()) &&
      checkBoxes(item.groups, checkedItems)
  );

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      p={5}
      pb="120px" // Space for bottom navigation
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      <VStack spacing={6} maxW="1200px" mx="auto">
        {/* Header */}
        <Box textAlign="center" mt={4}>
          <Heading
            size="2xl"
            color="white"
            fontWeight="600"
            textShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          >
            Chats
          </Heading>
          <Box w="200px" h="2px" bg="white" mx="auto" mt={2} opacity={0.8} />
        </Box>

        {/* Search and Filter Section */}
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          borderRadius="16px"
          p={6}
          w="100%"
          maxW="800px"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={5}>
            {/* Search Bar */}
            <HStack w="100%" spacing={3}>
              <Box color="gray.500">
                <LuSearch size={20} />
              </Box>
              <Input
                placeholder="Search"
                value={inputValue}
                onChange={handleSearchChange}
                borderRadius="12px"
                border="2px solid rgba(102, 126, 234, 0.1)"
                bg="rgba(255, 255, 255, 0.8)"
                color="gray.800"
                _focus={{
                  borderColor: "#667eea",
                  bg: "rgba(255, 255, 255, 1)",
                  boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                }}
                _placeholder={{ color: "gray.500" }}
              />
            </HStack>

            {/* Category Filters */}
            <HStack spacing={8} justify="center" wrap="wrap" w="100%">
              {categories.map((category, index) => (
                <HStack
                  key={category}
                  spacing={2}
                  cursor="pointer"
                  onClick={() => {
                    const updatedItems = [...checkedItems];
                    updatedItems[index] = !updatedItems[index];
                    setCheckedItems(updatedItems);
                  }}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "rgba(102, 126, 234, 0.1)" }}
                  transition="all 0.2s ease"
                >
                  <Box
                    w="20px"
                    h="20px"
                    borderRadius="4px"
                    border="2px solid"
                    borderColor={checkedItems[index] ? "#667eea" : "gray.300"}
                    bg={checkedItems[index] ? "#667eea" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.2s ease"
                  >
                    {checkedItems[index] && (
                      <Box
                        w="12px"
                        h="8px"
                        borderLeft="2px solid white"
                        borderBottom="2px solid white"
                        transform="rotate(-45deg)"
                        mt="-2px"
                      />
                    )}
                  </Box>
                  <Text
                    color="gray.700"
                    fontWeight="500"
                    fontSize="sm"
                    userSelect="none"
                  >
                    {category}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* Add Group Button (Admin Only) */}
        {isAdmin && (
          <Dialog.Root placement="center" size="md">
            <Dialog.Trigger asChild>
              <Button
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                size="lg"
                borderRadius="12px"
                boxShadow="0 4px 20px rgba(102, 126, 234, 0.3)"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(102, 126, 234, 0.4)",
                }}
                transition="all 0.3s ease"
                w="200px"
              >
                Add Group
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
              <Dialog.Positioner>
                <Dialog.Content
                  bg="rgba(255, 255, 255, 0.95)"
                  borderRadius="16px"
                  p={6}
                  boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                >
                  <Dialog.Header>
                    <Dialog.Title
                      fontSize="xl"
                      fontWeight="600"
                      color="gray.800"
                    >
                      Add Group
                    </Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <VStack spacing={4}>
                      <Text color="gray.600" fontSize="sm">
                        Please provide the name and the link
                      </Text>
                      <Input
                        placeholder="Title"
                        value={newGroupTitle}
                        onChange={(e) => setNewGroupTitle(e.target.value)}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor="gray.300"
                        color="gray.800"
                        _focus={{
                          borderColor: "#667eea",
                          boxShadow: "0 0 0 1px #667eea",
                        }}
                      />
                      <Input
                        placeholder="Link"
                        value={newGroupLink}
                        onChange={(e) => setNewGroupLink(e.target.value)}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor="gray.300"
                        color="gray.800"
                        _focus={{
                          borderColor: "#667eea",
                          boxShadow: "0 0 0 1px #667eea",
                        }}
                      />
                    </VStack>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <HStack spacing={3}>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline" borderRadius="8px">
                          Cancel
                        </Button>
                      </Dialog.ActionTrigger>
                      <Dialog.ActionTrigger asChild>
                        <Button
                          bg="#667eea"
                          color="white"
                          borderRadius="8px"
                          onClick={handleAddGroup}
                          _hover={{ bg: "#5a67d8" }}
                        >
                          Confirm
                        </Button>
                      </Dialog.ActionTrigger>
                    </HStack>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      position="absolute"
                      top={4}
                      right={4}
                      size="sm"
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}

        {/* Chat Groups Accordion */}
        <Box w="100%" maxW="800px">
          <Accordion.Root
            variant="plain"
            collapsible
            defaultValue={["a"]}
          >
            <VStack spacing={4}>
              {filteredItems.map((item, index) => (
                <Accordion.Item
                  key={item.value}
                  value={item.value}
                  w="100%"
                >
                  <Box
                    bg="rgba(255, 255, 255, 0.95)"
                    borderRadius="16px"
                    boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    overflow="hidden"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <Accordion.ItemTrigger
                      p={4}
                      bg="transparent"
                      _hover={{ bg: "rgba(102, 126, 234, 0.05)" }}
                      transition="all 0.3s ease"
                    >
                      <HStack w="100%" spacing={4} align="center">
                        <Avatar.Root size="md" borderRadius="10px">
                          <Avatar.Image src={item.image} />
                          <Avatar.Fallback
                            name={item.title}
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            color="white"
                            fontWeight="600"
                          />
                        </Avatar.Root>
                        <Box flex="1" textAlign="center">
                          <Text
                            fontWeight="500"
                            color="gray.800"
                            fontSize="md"
                          >
                            {item.title}
                          </Text>
                        </Box>
                        <Accordion.ItemIndicator color="gray.600" />
                      </HStack>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Box p={4} pt={0}>
                        <VStack spacing={3} align="stretch">
                          <Text color="gray.600" fontSize="sm" textAlign="center">
                            {item.text}
                          </Text>
                          <HStack spacing={2} justify="center">
                            {item.groups.map((group) => (
                              <Box
                                key={group}
                                bg="rgba(102, 126, 234, 0.1)"
                                color="#667eea"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="500"
                              >
                                {group}
                              </Box>
                            ))}
                          </HStack>
                          <Button
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            color="white"
                            size="sm"
                            borderRadius="8px"
                            onClick={() => handleJoinGroup(item.link)}
                            _hover={{
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                            }}
                            transition="all 0.3s ease"
                            alignSelf="center"
                            w="120px"
                          >
                            Join Group
                          </Button>
                        </VStack>
                      </Box>
                    </Accordion.ItemContent>
                  </Box>
                </Accordion.Item>
              ))}
            </VStack>
          </Accordion.Root>
        </Box>
      </VStack>
    </Box>
  );
};

export default ChatLink;
