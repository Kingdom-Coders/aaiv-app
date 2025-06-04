import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Button, 
  HStack,
  Card,
  Alert,
  AlertIndicator,
  AlertTitle,
  AlertDescription,
  useDisclosure
} from '@chakra-ui/react';
import { FiUser, FiMail, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { logout, deleteSelfAccount } from '../../actions/userActions';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  // Get user info from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = userDelete;

  // Handle sign out
  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    dispatch(deleteSelfAccount());
    onClose();
    
    // Navigate to login after deletion
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      p={5}
      pb="120px" // Space for bottom navigation
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      <VStack spacing={6} maxW="600px" mx="auto">
        {/* Header */}
        <Box textAlign="center" mt={10}>
          <Heading
            size="2xl"
            color="white"
            fontWeight="600"
            textShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          >
            👤 Profile
          </Heading>
          <Box w="200px" h="2px" bg="white" mx="auto" mt={2} opacity={0.8} />
          <Text color="white" opacity={0.9} mt={2} fontSize="md">
            Manage your account settings
          </Text>
        </Box>

        {/* Status Messages */}
        {deleteError && (
          <Alert.Root status="error" borderRadius="12px">
            <AlertIndicator />
            <Box>
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Box>
          </Alert.Root>
        )}

        {deleteSuccess && (
          <Alert.Root status="success" borderRadius="12px">
            <AlertIndicator />
            <Box>
              <AlertTitle>Account Deleted!</AlertTitle>
              <AlertDescription>Your account has been successfully deleted. Redirecting...</AlertDescription>
            </Box>
          </Alert.Root>
        )}

        {/* User Information Card */}
        <Card.Root
          bg="rgba(255, 255, 255, 0.95)"
          borderRadius="16px"
          p={8}
          w="100%"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={6}>
            {/* Profile Icon */}
            <Box
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="50%"
              w="80px"
              h="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="2xl"
              fontWeight="bold"
            >
              {userInfo.firstName.charAt(0).toUpperCase()}{userInfo.lastName.charAt(0).toUpperCase()}
            </Box>

            {/* User Details */}
            <VStack spacing={4} w="100%">
              <HStack w="100%" p={4} bg="gray.50" borderRadius="12px">
                <FiUser color="#667eea" size={20} />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="sm" color="gray.600" fontWeight="500">
                    Full Name
                  </Text>
                  <Text fontSize="lg" color="gray.800" fontWeight="600">
                    {userInfo.firstName} {userInfo.lastName}
                  </Text>
                </VStack>
              </HStack>

              <HStack w="100%" p={4} bg="gray.50" borderRadius="12px">
                <FiMail color="#667eea" size={20} />
                <VStack align="start" spacing={0} flex={1}>
                  <Text fontSize="sm" color="gray.600" fontWeight="500">
                    Email Address
                  </Text>
                  <Text fontSize="lg" color="gray.800" fontWeight="600">
                    {userInfo.email}
                  </Text>
                </VStack>
              </HStack>

              {userInfo.isAdmin && (
                <HStack w="100%" p={4} bg="blue.50" borderRadius="12px">
                  <Text fontSize="sm" color="blue.600" fontWeight="600">
                    👑 Administrator Account
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </Card.Root>

        {/* Action Buttons */}
        <VStack spacing={4} w="100%">
          {/* Sign Out Button */}
          <Button
            leftIcon={<FiLogOut />}
            bg="rgba(255, 255, 255, 0.9)"
            color="gray.700"
            size="lg"
            borderRadius="12px"
            w="100%"
            maxW="400px"
            _hover={{
              bg: "rgba(255, 255, 255, 1)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
            }}
            transition="all 0.3s ease"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>

          {/* Delete Account Button */}
          <Button
            leftIcon={<FiTrash2 />}
            bg="rgba(220, 38, 38, 0.9)"
            color="white"
            size="lg"
            borderRadius="12px"
            w="100%"
            maxW="400px"
            _hover={{
              bg: "rgba(220, 38, 38, 1)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(220, 38, 38, 0.3)"
            }}
            transition="all 0.3s ease"
            onClick={onOpen}
            isLoading={deleteLoading || isDeleting}
            loadingText="Deleting Account..."
          >
            Delete Account
          </Button>
        </VStack>

        {/* Account Deletion Confirmation Modal */}
        {isOpen && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="1000"
            p={4}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            <Box
              bg="white"
              borderRadius="16px"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
              maxW="500px"
              w="100%"
              maxH="90vh"
              overflow="auto"
              position="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <Box
                p={6}
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                <HStack justify="space-between" align="center">
                  <HStack spacing={3}>
                    <Box
                      p={2}
                      bg="red.50"
                      borderRadius="8px"
                      color="red.500"
                    >
                      <FiTrash2 size={20} />
                    </Box>
                    <Text fontSize="lg" fontWeight="600" color="gray.800">
                      Delete Account
                    </Text>
                  </HStack>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    color="gray.500"
                    _hover={{ color: "gray.700", bg: "gray.100" }}
                  >
                    ✕
                  </Button>
                </HStack>
              </Box>

              {/* Body */}
              <Box p={6}>
                <VStack spacing={4} align="start">
                  <Text>
                    Are you sure you want to permanently delete your account? This action cannot be undone.
                  </Text>
                  <Box p={4} bg="red.50" borderRadius="8px" w="100%">
                    <Text fontSize="sm" color="red.600" fontWeight="500">
                      ⚠️ This will permanently delete:
                    </Text>
                    <VStack align="start" spacing={1} mt={2}>
                      <Text fontSize="sm" color="red.600">• Your profile and account information</Text>
                      <Text fontSize="sm" color="red.600">• All your posts and comments</Text>
                      <Text fontSize="sm" color="red.600">• Your participation in events and groups</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              {/* Footer */}
              <Box
                p={6}
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <HStack spacing={3} justify="flex-end">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                    onClick={handleDeleteAccount}
                    isLoading={deleteLoading}
                    loadingText="Deleting..."
                  >
                    Delete My Account
                  </Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Profile; 