import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction, listPosts, resetCreatePost } from "../../../actions/postActions";
import { MdArrowBack, MdSend } from "react-icons/md";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [bibleReference, setBibleReference] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const postCreate = useSelector((state) => state.postCreate);
  const { loading, error, success } = postCreate;

  // Reset post creation state when component mounts
  useEffect(() => {
    dispatch(resetCreatePost());
  }, [dispatch]);

  const resetHandler = () => {
    setTitle("");
    setBody("");
    setBibleReference("");
  };

  const submitHandler = () => {
    if (!title) return;
    
    const bibleVerse = bibleReference.trim() ? {
      reference: bibleReference.trim(),
      translation: "asv"
    } : null;
    
    dispatch(createPostAction(title, body, bibleVerse));
  };

  useEffect(() => {
    if (success) {
      resetHandler();
      dispatch(listPosts());
      navigate("/discussion");
    }
  }, [success, dispatch, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      submitHandler();
    }
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      p={5}
      pb="120px" // Space for bottom navigation
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      <VStack spacing={6} maxW="800px" mx="auto">
        {/* Header */}
        <Box textAlign="center" mt={10}>
          <Heading
            size="2xl"
            color="white"
            fontWeight="600"
            textShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
          >
            Create New Post
          </Heading>
          <Box w="200px" h="2px" bg="white" mx="auto" mt={2} opacity={0.8} />
        </Box>

        {/* Form Container */}
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          borderRadius="16px"
          p={8}
          w="100%"
          maxW="600px"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <VStack spacing={6}>
            {/* Error Display */}
            {error && (
              <Box
                bg="rgba(229, 62, 62, 0.1)"
                border="1px solid rgba(229, 62, 62, 0.3)"
                borderRadius="8px"
                p={4}
                w="100%"
              >
                <Text color="red.600" fontSize="sm" fontWeight="500">
                  Error: {error}
                </Text>
              </Box>
            )}

            {/* Title Input */}
            <Box w="100%">
              <Text
                color="gray.700"
                fontSize="sm"
                fontWeight="500"
                mb={2}
              >
                Post Title *
              </Text>
              <Input
                placeholder="Enter your post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                borderRadius="12px"
                border="2px solid rgba(102, 126, 234, 0.1)"
                bg="rgba(255, 255, 255, 0.8)"
                color="gray.800"
                fontSize="md"
                p={4}
                _focus={{
                  borderColor: "#667eea",
                  bg: "rgba(255, 255, 255, 1)",
                  boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                }}
                _placeholder={{ color: "gray.500" }}
              />
            </Box>

            {/* Body Textarea */}
            <Box w="100%">
              <Text
                color="gray.700"
                fontSize="sm"
                fontWeight="500"
                mb={2}
              >
                Post Content
              </Text>
              <Textarea
                placeholder="Share your thoughts, questions, or insights..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyPress={handleKeyPress}
                borderRadius="12px"
                border="2px solid rgba(102, 126, 234, 0.1)"
                bg="rgba(255, 255, 255, 0.8)"
                color="gray.800"
                fontSize="md"
                p={4}
                rows={6}
                resize="vertical"
                _focus={{
                  borderColor: "#667eea",
                  bg: "rgba(255, 255, 255, 1)",
                  boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                }}
                _placeholder={{ color: "gray.500" }}
              />
              <Text
                color="gray.500"
                fontSize="xs"
                mt={1}
                textAlign="right"
              >
                Tip: Press Ctrl+Enter to submit
              </Text>
            </Box>

            {/* Bible Verse Section */}
            <Box w="100%">
              <Text
                color="gray.700"
                fontSize="sm"
                fontWeight="500"
                mb={2}
              >
                Bible Verse Reference (Optional)
              </Text>
              <VStack spacing={3}>
                <Input
                  placeholder="e.g., John 3:16, Psalm 23:1, Romans 8:28"
                  value={bibleReference}
                  onChange={(e) => setBibleReference(e.target.value)}
                  borderRadius="12px"
                  border="2px solid rgba(102, 126, 234, 0.1)"
                  bg="rgba(255, 255, 255, 0.8)"
                  color="gray.800"
                  fontSize="md"
                  p={4}
                  _focus={{
                    borderColor: "#667eea",
                    bg: "rgba(255, 255, 255, 1)",
                    boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                  }}
                  _placeholder={{ color: "gray.500" }}
                />
              </VStack>
              <Text
                color="gray.500"
                fontSize="xs"
                mt={1}
              >
                Add a Bible verse to support your discussion (ASV translation)
              </Text>
            </Box>

            {/* Action Buttons */}
            <HStack spacing={4} w="100%" justify="center" pt={4}>
              <Button
                variant="outline"
                size="lg"
                borderRadius="12px"
                borderColor="gray.300"
                color="gray.600"
                _hover={{
                  borderColor: "gray.400",
                  bg: "gray.50",
                }}
                leftIcon={<MdArrowBack size={18} />}
                onClick={() => navigate("/discussion")}
                w="140px"
              >
                Back
              </Button>
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
                _disabled={{
                  opacity: 0.6,
                  cursor: "not-allowed",
                  transform: "none",
                }}
                transition="all 0.3s ease"
                leftIcon={<MdSend size={18} />}
                onClick={submitHandler}
                isLoading={loading}
                loadingText="Creating..."
                isDisabled={!title.trim()}
                w="140px"
              >
                Submit
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Help Text */}
        <Box
          bg="rgba(255, 255, 255, 0.1)"
          borderRadius="12px"
          p={4}
          maxW="600px"
          w="100%"
        >
          <Text
            color="white"
            fontSize="sm"
            textAlign="center"
            opacity={0.9}
          >
            Share your thoughts, ask questions, or start meaningful discussions with the community.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CreatePost;
