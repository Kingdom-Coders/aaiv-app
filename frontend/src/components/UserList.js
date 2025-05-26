import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, listUsers, updateUserAdminStatus } from '../actions/userActions';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Avatar,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import { MdAdminPanelSettings, MdPerson, MdDelete, MdSecurity } from 'react-icons/md';
import { FaUserShield, FaUser, FaUserTimes } from 'react-icons/fa';
import "./UserList.css"


function UserList() {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userList = useSelector((state) => state.userList  || {});
    const {loading, users, error} = userList;

    const userDelete = useSelector((state) => state.userDelete  || {});
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = userDelete;

    const userUpdateAdmin = useSelector((state) => state.userUpdateAdmin || {});
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdateAdmin;

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(id)); 
        }
    };

    const handlePromote = (userId, currentAdminStatus) => {
        const action = currentAdminStatus ? "demote" : "promote";
        const message = currentAdminStatus 
            ? "Are you sure you want to remove admin privileges from this user?"
            : "Are you sure you want to promote this user to admin?";
            
        if (window.confirm(message)) {
            dispatch(updateUserAdminStatus(userId, !currentAdminStatus));
        }
    };

    // Generate initials for avatar
    const getInitials = (user) => {
        if (!user) return 'U';
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        
        if (firstName && lastName) {
            return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        } else if (firstName) {
            return firstName.charAt(0).toUpperCase();
        } else if (lastName) {
            return lastName.charAt(0).toUpperCase();
        }
        return 'U';
    };

    // Get full name
    const getFullName = (user) => {
        if (!user) return 'Unknown User';
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        } else if (firstName) {
            return firstName;
        } else if (lastName) {
            return lastName;
        }
        return 'Unknown User';
    };

    // Format join date
    const formatJoinDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric',
            month: 'short', 
            day: 'numeric' 
        });
    };

    useEffect(() => {
        dispatch(listUsers()); // Fetch users when component loads
    }, [dispatch, successDelete, successUpdate]);

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
                        User Management
                    </Heading>
                    <Box w="200px" h="2px" bg="white" mx="auto" mt={2} opacity={0.8} />
                    <Text color="white" opacity={0.9} mt={2} fontSize="md">
                        Manage user roles and permissions
                    </Text>
                </Box>

                {/* Loading State */}
                {loading && (
                    <Box
                        bg="rgba(255, 255, 255, 0.95)"
                        borderRadius="16px"
                        p={8}
                        w="100%"
                        maxW="800px"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                        textAlign="center"
                    >
                        <VStack spacing={4}>
                            <Spinner size="lg" color="#667eea" />
                            <Text color="gray.600" fontSize="md">
                                Loading users...
                            </Text>
                        </VStack>
                    </Box>
                )}

                {/* Error State */}
                {error && (
                    <Box
                        bg="rgba(255, 255, 255, 0.95)"
                        borderRadius="16px"
                        p={6}
                        w="100%"
                        maxW="800px"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                    >
                        <Box
                            bg="rgba(229, 62, 62, 0.1)"
                            border="1px solid rgba(229, 62, 62, 0.3)"
                            borderRadius="8px"
                            p={4}
                            w="100%"
                        >
                            <Text color="red.600" fontSize="sm" fontWeight="500">
                                Error loading users: {error}
                            </Text>
                        </Box>
                    </Box>
                )}

                {/* Update Error */}
                {errorUpdate && (
                    <Box
                        bg="rgba(255, 255, 255, 0.95)"
                        borderRadius="16px"
                        p={4}
                        w="100%"
                        maxW="800px"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(255, 255, 255, 0.2)"
                    >
                        <Box
                            bg="rgba(229, 62, 62, 0.1)"
                            border="1px solid rgba(229, 62, 62, 0.3)"
                            borderRadius="8px"
                            p={3}
                            w="100%"
                        >
                            <Text color="red.600" fontSize="sm" fontWeight="500">
                                Error updating user: {errorUpdate}
                            </Text>
                        </Box>
                    </Box>
                )}

                  {/* Summary Statistics */}
                  {!loading && !error && users && users.length > 0 && (
                    <Box
                        bg="rgba(255, 255, 255, 0.1)"
                        borderRadius="12px"
                        p={4}
                        maxW="800px"
                        w="100%"
                    >
                        <HStack justify="center" spacing={8}>
                            <VStack spacing={1}>
                                <Text color="white" fontSize="2xl" fontWeight="bold">
                                    {users.length}
                                </Text>
                                <Text color="white" fontSize="sm" opacity={0.9}>
                                    Total Users
                                </Text>
                            </VStack>
                            <VStack spacing={1}>
                                <Text color="white" fontSize="2xl" fontWeight="bold">
                                    {users.filter(user => user.isAdmin).length}
                                </Text>
                                <Text color="white" fontSize="sm" opacity={0.9}>
                                    Admins
                                </Text>
                            </VStack>
                            <VStack spacing={1}>
                                <Text color="white" fontSize="2xl" fontWeight="bold">
                                    {users.filter(user => !user.isAdmin).length}
                                </Text>
                                <Text color="white" fontSize="sm" opacity={0.9}>
                                    Regular Users
                                </Text>
                            </VStack>
                        </HStack>
                    </Box>
                )}

                {/* Users List */}
                {!loading && !error && users && (
                    <Box w="100%" maxW="800px">
                        {users.length === 0 ? (
                            <Box
                                bg="rgba(255, 255, 255, 0.95)"
                                borderRadius="16px"
                                p={8}
                                w="100%"
                                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(255, 255, 255, 0.2)"
                                textAlign="center"
                            >
                                <VStack spacing={4}>
                                    <Text color="gray.600" fontSize="lg" fontWeight="500">
                                        No users found
                                    </Text>
                                    <Text color="gray.500" fontSize="sm">
                                        Users will appear here once they register.
                                    </Text>
                                </VStack>
                            </Box>
                        ) : (
                            <VStack spacing={4}>
                                {users.map((user) => (
                                    <Box
                                        key={user._id}
                                        w="100%"
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
                                        <Box p={6}>
                                            <HStack spacing={4} align="flex-start" w="100%">
                                                {/* Avatar */}
                                                <Avatar.Root size="lg" borderRadius="12px">
                                                    <Avatar.Fallback
                                                        // bg="#6B7280"
                                                        color="white"
                                                        fontSize="lg"
                                                        fontWeight="600"
                                                    >
                                                        {getInitials(user)}
                                                    </Avatar.Fallback>
                                                </Avatar.Root>

                                                {/* User Info */}
                                                <Box flex="1">
                                                    <HStack spacing={3} align="center" mb={2}>
                                                        <Text
                                                            fontWeight="700"
                                                            color="gray.800"
                                                            fontSize="lg"
                                                        >
                                                            {getFullName(user)}
                                                        </Text>
                                                        
                                                        {/* Role Badge */}
                                                        <Badge
                                                            bg={user.isAdmin ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "rgba(107, 114, 128, 0.1)"}
                                                            color={user.isAdmin ? "white" : "gray.600"}
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            fontSize="xs"
                                                            fontWeight="600"
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                        >
                                                            {user.isAdmin ? <FaUserShield size={12} /> : <FaUser size={12} />}
                                                            {user.isAdmin ? "Admin" : "User"}
                                                        </Badge>

                                                        {/* Self indicator */}
                                                        {user._id === userInfo._id && (
                                                            <Badge
                                                                bg="rgba(34, 197, 94, 0.1)"
                                                                color="green.600"
                                                                px={2}
                                                                py={1}
                                                                borderRadius="full"
                                                                fontSize="xs"
                                                                fontWeight="500"
                                                            >
                                                                You
                                                            </Badge>
                                                        )}
                                                    </HStack>

                                                    <Text
                                                        color="gray.600"
                                                        fontSize="sm"
                                                        mb={2}
                                                    >
                                                        {user.email}
                                                    </Text>
{/* 
                                                    <Text
                                                        color="gray.500"
                                                        fontSize="xs"
                                                        mb={4}
                                                    >
                                                        Joined {formatJoinDate(user.createdAt)}
                                                    </Text> */}

                                                    {/* Action Buttons */}
                                                    <HStack spacing={3}>
                                                        {user._id === userInfo._id ? (
                                                            <Text
                                                                color="gray.500"
                                                                fontSize="sm"
                                                                fontStyle="italic"
                                                            >
                                                                Cannot perform actions on yourself
                                                            </Text>
                                                        ) : (
                                                            <>
                                                                {/* Admin Toggle Button */}
                                                                <Button
                                                                    size="sm"
                                                                    bg={user.isAdmin ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)"}
                                                                    color="white"
                                                                    borderRadius="8px"
                                                                    fontWeight="600"
                                                                    leftIcon={user.isAdmin ? <FaUserTimes size={14} /> : <FaUserShield size={14} />}
                                                                    isLoading={loadingUpdate}
                                                                    loadingText={user.isAdmin ? "Removing..." : "Promoting..."}
                                                                    onClick={() => handlePromote(user._id, user.isAdmin)}
                                                                    _hover={{
                                                                        transform: "translateY(-1px)",
                                                                        boxShadow: user.isAdmin ? "0 4px 20px rgba(251, 191, 36, 0.3)" : "0 4px 20px rgba(16, 185, 129, 0.3)",
                                                                    }}
                                                                    transition="all 0.2s ease"
                                                                >
                                                                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                                                                </Button>

                                                                {/* Delete Button */}
                                                                <Button
                                                                    size="sm"
                                                                    bg="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                                                                    color="white"
                                                                    borderRadius="8px"
                                                                    fontWeight="600"
                                                                    leftIcon={<MdDelete size={16} />}
                                                                    isLoading={loadingDelete}
                                                                    loadingText="Deleting..."
                                                                    onClick={() => handleDelete(user._id)}
                                                                    _hover={{
                                                                        transform: "translateY(-1px)",
                                                                        boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)",
                                                                    }}
                                                                    transition="all 0.2s ease"
                                                                >
                                                                    Delete User
                                                                </Button>
                                                            </>
                                                        )}
                                                    </HStack>
                                                </Box>
                                            </HStack>
                                        </Box>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </Box>
                )}

                {/* Help Text */}
                {!loading && !error && (
                    <Box
                        bg="rgba(255, 255, 255, 0.1)"
                        borderRadius="12px"
                        p={4}
                        maxW="800px"
                        w="100%"
                    >
                        <Text
                            color="white"
                            fontSize="sm"
                            textAlign="center"
                            opacity={0.9}
                        >
                            Manage user permissions and roles. Admin users have full access to all features.
                        </Text>
                    </Box>
                )}
            </VStack>
        </Box>
  )
}

export default UserList