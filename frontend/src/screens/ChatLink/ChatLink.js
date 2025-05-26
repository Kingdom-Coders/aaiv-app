import React, { useState, useEffect } from "react";
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
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { LuSearch, LuPencil, LuTrash } from "react-icons/lu";
import { listGroups, createGroupAction, updateGroupAction, deleteGroupAction } from "../../actions/groupActions";

const categories = ["outdoors", "sports", "academic", "social", "other"];
const categoryDisplayNames = {
  "outdoors": "Outdoors",
  "sports": "Sports", 
  "academic": "Academic",
  "social": "Social",
  "other": "Other"
};

const ChatLink = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const groupList = useSelector((state) => state.groupList);
  const { loading: groupsLoading, error: groupsError, groups } = groupList;
  
  const groupCreate = useSelector((state) => state.groupCreate);
  const { loading: createLoading, error: createError, success: createSuccess } = groupCreate;

  const groupUpdate = useSelector((state) => state.groupUpdate);
  const { loading: updateLoading, error: updateError, success: updateSuccess } = groupUpdate;

  const groupDelete = useSelector((state) => state.groupDelete);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = groupDelete;

  const isAdmin = userInfo && userInfo.isAdmin;

  const [inputValue, setInputValue] = useState("");
  const [checkedItems, setCheckedItems] = useState([true, true, true, true, true]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupLink, setNewGroupLink] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedBadges, setSelectedBadges] = useState([]);

  // Edit group state
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupLink, setEditGroupLink] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editSelectedBadges, setEditSelectedBadges] = useState([]);

  // Delete confirmation state
  const [deletingGroup, setDeletingGroup] = useState(null);

  // Fetch groups when component mounts
  useEffect(() => {
    dispatch(listGroups());
  }, [dispatch]);

  // Reset form and refetch groups after successful creation
  useEffect(() => {
    if (createSuccess) {
      setNewGroupName("");
      setNewGroupLink("");
      setNewGroupDescription("");
      setSelectedBadges([]);
      dispatch(listGroups()); // Refresh the groups list
    }
  }, [createSuccess, dispatch]);

  // Reset edit form and refetch groups after successful update
  useEffect(() => {
    if (updateSuccess) {
      setEditingGroup(null);
      setEditGroupName("");
      setEditGroupLink("");
      setEditGroupDescription("");
      setEditSelectedBadges([]);
      dispatch(listGroups()); // Refresh the groups list
    }
  }, [updateSuccess, dispatch]);

  // Refetch groups after successful deletion
  useEffect(() => {
    if (deleteSuccess) {
      setDeletingGroup(null);
      dispatch(listGroups()); // Refresh the groups list
    }
  }, [deleteSuccess, dispatch]);

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBadgeToggle = (badge) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  const handleEditBadgeToggle = (badge) => {
    setEditSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  const checkBoxes = (groupBadges, checkedItems) => {
    for (let i = 0; i < groupBadges.length; i++) {
      if (checkedItems[categories.indexOf(groupBadges[i])]) {
        return true;
      }
    }
    return false;
  };

  const handleAddGroup = () => {
    if (newGroupName.trim() && newGroupLink.trim() && newGroupDescription.trim()) {
      dispatch(createGroupAction(newGroupName, newGroupLink, selectedBadges, newGroupDescription));
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setEditGroupName(group.name);
    setEditGroupLink(group.link);
    setEditGroupDescription(group.description);
    setEditSelectedBadges(group.badges || []);
  };

  const handleUpdateGroup = () => {
    if (editGroupName.trim() && editGroupLink.trim() && editGroupDescription.trim() && editingGroup) {
      dispatch(updateGroupAction(editingGroup._id, editGroupName, editGroupLink, editSelectedBadges, editGroupDescription));
    }
  };

  const handleDeleteGroup = (group) => {
    setDeletingGroup(group);
  };

  const confirmDeleteGroup = () => {
    if (deletingGroup) {
      dispatch(deleteGroupAction(deletingGroup._id));
    }
  };

  const handleJoinGroup = (link) => {
    window.open(link, '_blank');
  };

  const filteredGroups = groups?.filter(
    (group) =>
      group.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      (group.badges.length === 0 || checkBoxes(group.badges, checkedItems))
  ) || [];

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
            💬 Chats
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
            <HStack spacing={6} justify="center" wrap="wrap" w="100%">
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
                    {categoryDisplayNames[category]}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Box>

        {/* Add Group Button (Admin Only) */}
        {isAdmin && (
          <Dialog.Root placement="center" size="lg">
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
                border="2px solid rgba(255, 255, 255, 0.3)"
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
                  maxW="500px"
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
                      {createError && (
                        <Box
                          bg="red.50"
                          color="red.500"
                          p={3}
                          borderRadius="md"
                          w="100%"
                          fontSize="sm"
                        >
                          {createError}
                        </Box>
                      )}
                      <Text color="gray.600" fontSize="sm">
                        Please provide all group details
                      </Text>
                      <Input
                        placeholder="Group Name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
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
                        placeholder="Group Link (Discord, WhatsApp, etc.)"
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
                      <Textarea
                        placeholder="Description"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor="gray.300"
                        color="gray.800"
                        rows={3}
                        _focus={{
                          borderColor: "#667eea",
                          boxShadow: "0 0 0 1px #667eea",
                        }}
                      />
                      
                      {/* Badge Selection */}
                      <Box w="100%">
                        <Text color="gray.700" fontSize="sm" mb={2} fontWeight="500">
                          Categories (Select all that apply):
                        </Text>
                        <HStack spacing={3} wrap="wrap">
                          {categories.map((badge) => (
                            <HStack
                              key={badge}
                              spacing={2}
                              cursor="pointer"
                              onClick={() => handleBadgeToggle(badge)}
                              p={2}
                              borderRadius="md"
                              bg={selectedBadges.includes(badge) ? "rgba(102, 126, 234, 0.1)" : "transparent"}
                              border="1px solid"
                              borderColor={selectedBadges.includes(badge) ? "#667eea" : "gray.300"}
                              _hover={{ bg: "rgba(102, 126, 234, 0.05)" }}
                              transition="all 0.2s ease"
                            >
                              <Box
                                w="16px"
                                h="16px"
                                borderRadius="3px"
                                border="2px solid"
                                borderColor={selectedBadges.includes(badge) ? "#667eea" : "gray.300"}
                                bg={selectedBadges.includes(badge) ? "#667eea" : "transparent"}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                transition="all 0.2s ease"
                              >
                                {selectedBadges.includes(badge) && (
                                  <Box
                                    w="8px"
                                    h="6px"
                                    borderLeft="2px solid white"
                                    borderBottom="2px solid white"
                                    transform="rotate(-45deg)"
                                    mt="-1px"
                                  />
                                )}
                              </Box>
                              <Text
                                color="gray.700"
                                fontWeight="400"
                                fontSize="sm"
                                userSelect="none"
                              >
                                {categoryDisplayNames[badge]}
                              </Text>
                            </HStack>
                          ))}
                        </HStack>
                      </Box>
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
                          isLoading={createLoading}
                          loadingText="Creating..."
                        >
                          Create Group
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

        {/* Edit Group Dialog */}
        {editingGroup && (
          <Dialog.Root open={!!editingGroup} placement="center" size="lg">
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
                  maxW="500px"
                >
                  <Dialog.Header>
                    <Dialog.Title
                      fontSize="xl"
                      fontWeight="600"
                      color="gray.800"
                    >
                      Edit Group
                    </Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <VStack spacing={4}>
                      {updateError && (
                        <Box
                          bg="red.50"
                          color="red.500"
                          p={3}
                          borderRadius="md"
                          w="100%"
                          fontSize="sm"
                        >
                          {updateError}
                        </Box>
                      )}
                      <Text color="gray.600" fontSize="sm">
                        Update group information
                      </Text>
                      <Input
                        placeholder="Group Name"
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
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
                        placeholder="Group Link (Discord, WhatsApp, etc.)"
                        value={editGroupLink}
                        onChange={(e) => setEditGroupLink(e.target.value)}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor="gray.300"
                        color="gray.800"
                        _focus={{
                          borderColor: "#667eea",
                          boxShadow: "0 0 0 1px #667eea",
                        }}
                      />
                      <Textarea
                        placeholder="Description"
                        value={editGroupDescription}
                        onChange={(e) => setEditGroupDescription(e.target.value)}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor="gray.300"
                        color="gray.800"
                        rows={3}
                        _focus={{
                          borderColor: "#667eea",
                          boxShadow: "0 0 0 1px #667eea",
                        }}
                      />
                      
                      {/* Badge Selection */}
                      <Box w="100%">
                        <Text color="gray.700" fontSize="sm" mb={2} fontWeight="500">
                          Categories (Select all that apply):
                        </Text>
                        <HStack spacing={3} wrap="wrap">
                          {categories.map((badge) => (
                            <HStack
                              key={badge}
                              spacing={2}
                              cursor="pointer"
                              onClick={() => handleEditBadgeToggle(badge)}
                              p={2}
                              borderRadius="md"
                              bg={editSelectedBadges.includes(badge) ? "rgba(102, 126, 234, 0.1)" : "transparent"}
                              border="1px solid"
                              borderColor={editSelectedBadges.includes(badge) ? "#667eea" : "gray.300"}
                              _hover={{ bg: "rgba(102, 126, 234, 0.05)" }}
                              transition="all 0.2s ease"
                            >
                              <Box
                                w="16px"
                                h="16px"
                                borderRadius="3px"
                                border="2px solid"
                                borderColor={editSelectedBadges.includes(badge) ? "#667eea" : "gray.300"}
                                bg={editSelectedBadges.includes(badge) ? "#667eea" : "transparent"}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                transition="all 0.2s ease"
                              >
                                {editSelectedBadges.includes(badge) && (
                                  <Box
                                    w="8px"
                                    h="6px"
                                    borderLeft="2px solid white"
                                    borderBottom="2px solid white"
                                    transform="rotate(-45deg)"
                                    mt="-1px"
                                  />
                                )}
                              </Box>
                              <Text
                                color="gray.700"
                                fontWeight="400"
                                fontSize="sm"
                                userSelect="none"
                              >
                                {categoryDisplayNames[badge]}
                              </Text>
                            </HStack>
                          ))}
                        </HStack>
                      </Box>
                    </VStack>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <HStack spacing={3}>
                      <Button 
                        variant="outline" 
                        borderRadius="8px"
                        onClick={() => setEditingGroup(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        bg="#667eea"
                        color="white"
                        borderRadius="8px"
                        onClick={handleUpdateGroup}
                        _hover={{ bg: "#5a67d8" }}
                        isLoading={updateLoading}
                        loadingText="Updating..."
                      >
                        Update Group
                      </Button>
                    </HStack>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      position="absolute"
                      top={4}
                      right={4}
                      size="sm"
                      onClick={() => setEditingGroup(null)}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}

        {/* Delete Confirmation Dialog */}
        {deletingGroup && (
          <Dialog.Root open={!!deletingGroup} placement="center" size="sm">
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
                  maxW="400px"
                >
                  <Dialog.Header>
                    <Dialog.Title
                      fontSize="lg"
                      fontWeight="600"
                      color="gray.800"
                    >
                      Delete Group
                    </Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <VStack spacing={3}>
                      {deleteError && (
                        <Box
                          bg="red.50"
                          color="red.500"
                          p={3}
                          borderRadius="md"
                          w="100%"
                          fontSize="sm"
                        >
                          {deleteError}
                        </Box>
                      )}
                      <Text color="gray.600" fontSize="sm" textAlign="center">
                        Are you sure you want to delete "{deletingGroup.name}"? This action cannot be undone.
                      </Text>
                    </VStack>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <HStack spacing={3}>
                      <Button 
                        variant="outline" 
                        borderRadius="8px"
                        onClick={() => setDeletingGroup(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        bg="red.500"
                        color="white"
                        borderRadius="8px"
                        onClick={confirmDeleteGroup}
                        _hover={{ bg: "red.600" }}
                        isLoading={deleteLoading}
                        loadingText="Deleting..."
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      position="absolute"
                      top={4}
                      right={4}
                      size="sm"
                      onClick={() => setDeletingGroup(null)}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}

        {/* Loading State */}
        {groupsLoading && (
          <Box textAlign="center" py={8}>
            <Text color="white" fontSize="lg">Loading groups...</Text>
          </Box>
        )}

        {/* Error State */}
        {groupsError && (
          <Box
            bg="rgba(255, 255, 255, 0.9)"
            borderRadius="12px"
            p={4}
            maxW="800px"
            w="100%"
          >
            <Text color="red.500" textAlign="center">
              Error loading groups: {groupsError}
            </Text>
          </Box>
        )}

        {/* Chat Groups Accordion */}
        {!groupsLoading && !groupsError && (
          <Box w="100%" maxW="900px">
            {filteredGroups.length === 0 ? (
              <Box
                bg="rgba(255, 255, 255, 0.9)"
                borderRadius="16px"
                p={8}
                textAlign="center"
              >
                <Text color="gray.600" fontSize="lg">
                  {groups?.length === 0 ? "No groups available yet" : "No groups match your search"}
                </Text>
              </Box>
            ) : (
              <Accordion.Root
                variant="plain"
                collapsible
                defaultValue={[filteredGroups[0]?._id]}
              >
                <VStack spacing={6}>
                  {filteredGroups.map((group) => (
                    <Accordion.Item
                      key={group._id}
                      value={group._id}
                      w="100%"
                    >
                      <Box
                        bg="rgba(255, 255, 255, 0.95)"
                        borderRadius="20px"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        overflow="hidden"
                        transition="all 0.3s ease"
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        {/* Group Header - Accordion Trigger */}
                        <Accordion.ItemTrigger
                          p={6}
                          bg="transparent"
                          _hover={{ bg: "rgba(102, 126, 234, 0.05)" }}
                          transition="all 0.3s ease"
                          borderBottom="1px solid rgba(0, 0, 0, 0.05)"
                        >
                          <HStack spacing={4} align="center" justify="space-between" w="100%">
                            <HStack spacing={4} flex="1">
                              <Avatar.Root size="md" borderRadius="10px">
                                <Avatar.Fallback
                                  name={group.name}
                                  color="white"
                                  fontWeight="600"
                                />
                              </Avatar.Root>
                              <VStack align="start" spacing={1} flex="1">
                                <Text
                                  fontWeight="600"
                                  color="gray.800"
                                  fontSize="xl"
                                  lineHeight="1.2"
                                >
                                  {group.name}
                                </Text>
                                {group.badges && group.badges.length > 0 && (
                                  <HStack spacing={2} wrap="wrap">
                                    {group.badges.map((badge) => (
                                      <Box
                                        key={badge}
                                        bg="linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                                        color="#667eea"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="xs"
                                        fontWeight="600"
                                        border="1px solid rgba(102, 126, 234, 0.2)"
                                      >
                                        {categoryDisplayNames[badge]}
                                      </Box>
                                    ))}
                                  </HStack>
                                )}
                              </VStack>
                            </HStack>
                            
                            {/* Admin Controls */}
                            {isAdmin && (
                              <HStack spacing={2}>
                                <IconButton
                                  size="md"
                                  variant="ghost"
                                  bg="rgba(59, 130, 246, 0.1)"
                                  color="#3b82f6"
                                  borderRadius="12px"
                                  _hover={{ 
                                    bg: "rgba(59, 130, 246, 0.2)",
                                    transform: "scale(1.05)"
                                  }}
                                  transition="all 0.2s ease"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditGroup(group);
                                  }}
                                >
                                  <LuPencil size={18} />
                                </IconButton>
                                <IconButton
                                  size="md"
                                  variant="ghost"
                                  bg="rgba(239, 68, 68, 0.1)"
                                  color="#ef4444"
                                  borderRadius="12px"
                                  _hover={{ 
                                    bg: "rgba(239, 68, 68, 0.2)",
                                    transform: "scale(1.05)"
                                  }}
                                  transition="all 0.2s ease"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteGroup(group);
                                  }}
                                >
                                  <LuTrash size={18} />
                                </IconButton>
                              </HStack>
                            )}
                            
                            <Accordion.ItemIndicator color="gray.600" />
                          </HStack>
                        </Accordion.ItemTrigger>

                        {/* Group Content - Accordion Content */}
                        <Accordion.ItemContent>
                          <Box p={6}>
                            <VStack spacing={5} align="stretch">
                              {/* Description */}
                              <Box>
                                <Text 
                                  color="gray.600" 
                                  fontSize="md" 
                                  lineHeight="1.6"
                                  textAlign="center"
                                  bg="rgba(102, 126, 234, 0.04)"
                                  p={4}
                                  borderRadius="12px"
                                  border="1px solid rgba(102, 126, 234, 0.1)"
                                >
                                  {group.description}
                                </Text>
                              </Box>

                              {/* Join Group Button */}
                              <Box textAlign="center">
                                <Button
                                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                  color="white"
                                  size="lg"
                                  borderRadius="16px"
                                  onClick={() => handleJoinGroup(group.link)}
                                  _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                                  }}
                                  transition="all 0.3s ease"
                                  w="200px"
                                  h="50px"
                                  fontSize="md"
                                  fontWeight="600"
                                  border="2px solid rgba(255, 255, 255, 0.3)"
                                  shadow="0 4px 15px rgba(102, 126, 234, 0.2)"
                                  marginTop="10px"
                                >
                                  Join Group
                                </Button>
                              </Box>

                              {/* Group Meta Info */}
                              {/* {group.user && (
                                <Box textAlign="center" pt={2}>
                                  <Text 
                                    color="gray.400" 
                                    fontSize="sm" 
                                    fontStyle="italic"
                                  >
                                    Created by {group.user.name}
                                  </Text>
                                </Box>
                              )} */}
                            </VStack>
                          </Box>
                        </Accordion.ItemContent>
                      </Box>
                    </Accordion.Item>
                  ))}
                </VStack>
              </Accordion.Root>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ChatLink;
