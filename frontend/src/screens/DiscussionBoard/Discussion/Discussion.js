import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Accordion,
  Avatar,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { BiMessageSquareDetail } from 'react-icons/bi';
import discussions from './DiscussionData';

const Discussion = () => {
  const navigate = useNavigate();

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
            Discussion Board
          </Heading>
          <Box w="200px" h="2px" bg="white" mx="auto" mt={2} opacity={0.8} />
        </Box>

        {/* Create Post Button */}
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
          leftIcon={<MdAdd size={20} />}
          onClick={() => navigate("/create-post")}
        >
          Create Post
        </Button>

        {/* Discussion Posts */}
        <Box w="100%" maxW="800px">
          <Accordion.Root
            variant="plain"
            collapsible
            defaultValue={["0"]}
          >
            <VStack spacing={4}>
              {discussions.map((item, index) => (
                <Accordion.Item
                  key={index}
                  value={index.toString()}
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
                          <Avatar.Fallback
                            name={item.verses}
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            color="white"
                            fontWeight="600"
                          />
                        </Avatar.Root>
                        <Box flex="1" textAlign="left">
                          <HStack spacing={2} align="center" mb={1}>
                            <Text
                              fontWeight="600"
                              color="gray.800"
                              fontSize="md"
                            >
                              {item.verses}
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
                              {item.date}
                            </Box>
                          </HStack>
                          <Text
                            color="gray.600"
                            fontSize="sm"
                            fontWeight="400"
                          >
                            {item.title}
                          </Text>
                        </Box>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="gray.600"
                            _hover={{ color: "#667eea", bg: "rgba(102, 126, 234, 0.1)" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/thread', { 
                                state: { 
                                  post: {
                                    verses: item.verses,
                                    title: item.title,
                                    date: item.date,
                                    applicationQuestions: item.applicationQuestions
                                  }
                                }
                              });
                            }}
                            leftIcon={<BiMessageSquareDetail size={16} />}
                          >
                            View
                          </Button>
                          <Accordion.ItemIndicator color="gray.600" />
                        </HStack>
                      </HStack>
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Box p={4} pt={0}>
                        <VStack spacing={2} align="stretch">
                          <Text
                            color="gray.700"
                            fontSize="sm"
                            fontWeight="500"
                            mb={2}
                          >
                            Application Questions:
                          </Text>
                          {item.applicationQuestions.map((question, qIndex) => (
                            <HStack key={qIndex} align="flex-start" spacing={3}>
                              <Box
                                w="6px"
                                h="6px"
                                borderRadius="full"
                                bg="#667eea"
                                mt={2}
                                flexShrink={0}
                              />
                              <Text color="gray.600" fontSize="sm" lineHeight="1.5">
                                {question}
                              </Text>
                            </HStack>
                          ))}
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

export default Discussion;
