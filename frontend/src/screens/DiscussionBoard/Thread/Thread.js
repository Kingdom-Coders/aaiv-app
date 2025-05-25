// hello world
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Avatar,
  Separator,
} from "@chakra-ui/react";
import { MdArrowBack, MdChatBubbleOutline } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const Thread = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get post data from navigation state, with fallback
  const postData = location.state?.post || {
    verses: "Romans 8:18-39",
    title: "Joy in Trials", 
    date: "Today",
    applicationQuestions: [
      "How does this truth challenge or encourage the way you see your relationship with Him?",
      "How can you apply this truth to your life?",
      "What is one thing you can do differently this week?"
    ]
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateFormatter = (date) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const givenDate = new Date(date);

    const postYear = givenDate.getFullYear();
    const postMonth = givenDate.getMonth() + 1;
    const postDay = givenDate.getDate();

    if (year === postYear && month === postMonth && day === postDay) {
      const diff = now - givenDate;
      const mins = diff / (1000 * 60);
      if (mins < 60) {
        return Math.floor(mins) + "m";
      } else {
        return Math.floor(diff / (1000 * 60 * 60)) + "h";
      }
    } else {
      return months[postMonth - 1] + " " + postDay;
    }
  };

  // when displayed, should have 1 as the first thread starter, then 2 as the first reply underneath
  // Then 3 next, then 4. Should look like IG comments where we don't indent after the first reply
  const threads = [
    {
      id: 1,
      postId: 3,
      user: "Jonah and Grace",
      body: "my thoughts on this verse are...",
      timestamp: "2025-04-12T08:09:00",
      replies: [
        {
          id: 1,
          user: "calvin",
          body: "word",
          replyTo: "Jonah and Grace",
          timestamp: "2025-04-14T08:09:00",
        },
        {
          id: 2,
          user: "christina",
          body: "i concur",
          replyTo: "Jonah and Grace",
          timestamp: "2025-05-10T02:11:00",
        },
        {
          id: 3,
          user: "jalenbrunsonlover",
          body: "@calvin KNICKS IN 4",
          replyTo: "calvin",
          timestamp: "2025-05-10T05:14:00",
        },
      ],
    },
    {
      id: 2,
      postId: 3,
      user: "Carson and Amy",
      body: "Our sg talked about blah blah blah today and it was very fruitful and awesome",
      timestamp: "2025-04-13T08:09:00",
      replies: [
        {
          id: 1,
          user: "chungus",
          body: "what",
          replyTo: "Carson and Amy",
          timestamp: "2025-04-24T08:09:00",
        },
        {
          id: 2,
          user: "davy",
          body: "i dont remember that",
          replyTo: "Carson and Amy",
          timestamp: "2025-05-10T01:11:00",
        },
        {
          id: 3,
          user: "tingus-pingus",
          body: "GO JETS",
          replyTo: "Carson and Amy",
          timestamp: "2025-05-10T04:14:00",
        },
      ],
    },
  ];

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
        <HStack
          w="100%"
          spacing={4}
          align="center"
          bg="rgba(255, 255, 255, 0.95)"
          borderRadius="16px"
          p={4}
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <Button
            variant="ghost"
            size="md"
            color="gray.600"
            _hover={{ 
              color: "#667eea", 
              bg: "rgba(102, 126, 234, 0.1)" 
            }}
            onClick={() => navigate("/discussion")}
            leftIcon={<MdArrowBack size={18} />}
          >
            Back
          </Button>
          <Separator orientation="vertical" h="24px" />
          <Box flex="1">
            <Heading
              size="lg"
              color="gray.800"
              fontWeight="600"
            >
              {postData.verses}
            </Heading>
            <Text color="gray.600" fontSize="sm" mt={1}>
              {postData.title}
            </Text>
          </Box>
          <Box
            bg="rgba(102, 126, 234, 0.1)"
            color="#667eea"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
            fontWeight="500"
          >
            {postData.date}
          </Box>
        </HStack>

        {/* Post Content */}
        <Box
          w="100%"
          bg="rgba(255, 255, 255, 0.95)"
          borderRadius="16px"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          p={6}
        >
          <VStack spacing={4} align="stretch">
            <Text
              color="gray.700"
              fontSize="md"
              fontWeight="600"
              mb={2}
            >
              Application Questions:
            </Text>
            {postData.applicationQuestions.map((question, qIndex) => (
              <HStack key={qIndex} align="flex-start" spacing={3}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="#667eea"
                  mt={2}
                  flexShrink={0}
                />
                <Text color="gray.600" fontSize="sm" lineHeight="1.6">
                  {question}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Thread Container */}
        <Box w="100%">
          <VStack spacing={4}>
            {threads?.length ? (
              threads.map((thread, index) => (
                <Box
                  key={thread.id}
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
                  {/* Main Thread */}
                  <Box p={6}>
                    <HStack spacing={4} align="flex-start" mb={4}>
                      <Avatar.Root size="md" borderRadius="10px">
                        <Avatar.Fallback
                          name={thread.user}
                          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          color="white"
                          fontWeight="600"
                        />
                      </Avatar.Root>
                      <Box flex="1">
                        <HStack spacing={2} align="center" mb={2}>
                          <Text
                            fontWeight="600"
                            color="gray.800"
                            fontSize="md"
                          >
                            {thread.user}
                          </Text>
                          <Box
                            bg="rgba(102, 126, 234, 0.1)"
                            color="#667eea"
                            px={2}
                            py={1}
                            borderRadius="full"
                            fontSize="xs"
                            fontWeight="500"
                          >
                            {dateFormatter(thread.timestamp)}
                          </Box>
                        </HStack>
                        <Text
                          color="gray.700"
                          fontSize="sm"
                          lineHeight="1.6"
                          mb={3}
                        >
                          {thread.body}
                        </Text>
                        <HStack spacing={3}>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="gray.600"
                            _hover={{ 
                              color: "#667eea", 
                              bg: "rgba(102, 126, 234, 0.1)" 
                            }}
                            leftIcon={<MdChatBubbleOutline size={16} />}
                            onClick={() => {}}
                          >
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="gray.600"
                            _hover={{ 
                              color: "#e53e3e", 
                              bg: "rgba(229, 62, 62, 0.1)" 
                            }}
                            leftIcon={<AiOutlineExclamationCircle size={16} />}
                            onClick={() => {}}
                          >
                            Report
                          </Button>
                        </HStack>
                      </Box>
                    </HStack>

                    {/* Replies */}
                    {thread.replies.length > 0 && (
                      <Box>
                        <Separator mb={4} />
                        <VStack spacing={4} align="stretch">
                          {thread.replies.map((reply, replyIndex) => (
                            <Box
                              key={reply.id}
                              pl={8}
                              borderLeft="2px solid"
                              borderColor="rgba(102, 126, 234, 0.2)"
                            >
                              <HStack spacing={3} align="flex-start">
                                <Avatar.Root size="sm" borderRadius="8px">
                                  <Avatar.Fallback
                                    name={reply.user}
                                    bg="rgba(102, 126, 234, 0.8)"
                                    color="white"
                                    fontWeight="500"
                                    fontSize="xs"
                                  />
                                </Avatar.Root>
                                <Box flex="1">
                                  <HStack spacing={2} align="center" mb={1}>
                                    <Text
                                      fontWeight="500"
                                      color="gray.700"
                                      fontSize="sm"
                                    >
                                      {reply.user}
                                    </Text>
                                    <Text
                                      color="gray.500"
                                      fontSize="xs"
                                    >
                                      {dateFormatter(reply.timestamp)}
                                    </Text>
                                  </HStack>
                                  <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    lineHeight="1.5"
                                    mb={2}
                                  >
                                    {reply.body}
                                  </Text>
                                  <HStack spacing={2}>
                                    <Button
                                      size="xs"
                                      variant="ghost"
                                      color="gray.500"
                                      _hover={{ 
                                        color: "#667eea", 
                                        bg: "rgba(102, 126, 234, 0.1)" 
                                      }}
                                      leftIcon={<MdChatBubbleOutline size={14} />}
                                      onClick={() => {}}
                                    >
                                      Reply
                                    </Button>
                                    <Button
                                      size="xs"
                                      variant="ghost"
                                      color="gray.500"
                                      _hover={{ 
                                        color: "#e53e3e", 
                                        bg: "rgba(229, 62, 62, 0.1)" 
                                      }}
                                      leftIcon={<AiOutlineExclamationCircle size={14} />}
                                      onClick={() => {}}
                                    >
                                      Report
                                    </Button>
                                  </HStack>
                                </Box>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                bg="rgba(255, 255, 255, 0.95)"
                borderRadius="16px"
                p={8}
                textAlign="center"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
              >
                <Text color="gray.600" fontSize="md">
                  No comments yet. Be the first to share your thoughts!
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Thread;
