import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Accordion,
  Spinner,
  useToast,
  IconButton,
  TriggerButton,
} from "@chakra-ui/react";
import { MdAdd, MdFlag } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";
import { listPosts } from "../../../actions/postActions";
import { resetDeletePost } from "../../../actions/postActions";
import { resetReportCreate } from "../../../actions/reportActions";
import ReportModal from "../../../components/ReportModal";
import usePullToRefresh from "../../../hooks/usePullToRefresh";
import PullToRefreshIndicator from "../../../components/PullToRefreshIndicator";
import ConfirmationModal from "../../../components/ConfirmationModal";

const Discussion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for tracking expanded posts
  const [expandedPosts, setExpandedPosts] = useState(new Set(["0"])); // Initialize with first post expanded
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Character limit for post preview
  const CHARACTER_LIMIT = 100;

  // Get posts from Redux state
  const postList = useSelector((state) => state.postList);
  const { loading, error, posts } = postList;

  // Get post delete state to refresh list after deletion
  const postDelete = useSelector((state) => state.postDelete);
  const { success: deleteSuccess } = postDelete;

  // Get user info for authentication check
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Pull-to-refresh functionality
  const { isPulling, isRefreshing, pullDistance, refreshProgress } =
    usePullToRefresh(() => {
      if (userInfo) {
        dispatch(listPosts());
      }
    });

  // Fetch posts when component mounts or after successful deletion
  useEffect(() => {
    if (userInfo) {
      dispatch(listPosts());
    }
  }, [dispatch, userInfo, deleteSuccess]);

  // Reset delete state when component mounts to prevent navigation issues
  useEffect(() => {
    dispatch(resetDeletePost());
  }, [dispatch]);

  // Clean up report state when component unmounts
  useEffect(() => {
    return () => {
      // Only reset report state if there's no active submission
      const reportCreate = postDelete; // Use existing selector pattern
      if (!reportCreate?.loading) {
        dispatch(resetReportCreate());
      }
    };
  }, [dispatch]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get author name from post
  const getAuthorName = (post) => {
    if (post.user && typeof post.user === "object") {
      if (post.user.firstName && post.user.lastName) {
        return `${post.user.firstName} ${post.user.lastName}`;
      } else if (post.user.firstName) {
        return post.user.firstName;
      } else if (post.user.lastName) {
        return post.user.lastName;
      }
    }
    return "Unknown User";
  };

  // Get truncated post body for preview
  const getTruncatedBody = (body) => {
    if (!body) return "No content provided";
    if (body.length <= CHARACTER_LIMIT) return body;
    return body.substring(0, CHARACTER_LIMIT) + "...";
  };

  // Get truncated title for display (or full title if expanded)
  const getTruncatedTitle = (title, index) => {
    if (!title) return "Untitled";
    const TITLE_LIMIT = 40; // Character limit for titles

    const isExpanded = expandedPosts.has(index.toString());

    // Show full title if post is expanded, truncated if not expanded
    if (isExpanded) {
      return title;
    }

    // Post is not expanded, so truncate if needed
    if (title.length <= TITLE_LIMIT) return title;
    return title.substring(0, TITLE_LIMIT) + "...";
  };

  // Handle accordion item click to toggle expanded state
  const handleAccordionItemClick = (postId, index) => {
    const newExpandedPosts = new Set(expandedPosts);

    if (newExpandedPosts.has(index.toString())) {
      newExpandedPosts.delete(index.toString());
    } else {
      newExpandedPosts.add(index.toString());
    }

    setExpandedPosts(newExpandedPosts);
  };

  // Enhanced close handler for report modal
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedPost(null);
    // Don't reset here - let the ReportModal handle its own state management
  };

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Pull-to-refresh indicator */}
      <PullToRefreshIndicator
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        refreshProgress={refreshProgress}
      />

      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        p={5}
        pb="120px" // Space for bottom navigation
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing={6} maxW="1200px" mx="auto">
          {/* Header */}
          <Box textAlign="center" mt={10}>
            <Heading
              size="2xl"
              color="white"
              fontWeight="600"
              textShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            >
              💬 Discussion Board
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
            border="2px solid rgba(255, 255, 255, 0.3)"
          >
            ✍️ Create Post
          </Button>

          <Button onClick={openModal}></Button>
          <ConfirmationModal
            isOpen={isOpen}
            onCancel={closeModal}
            onConfirm={closeModal}
            type={"warning"}
            message={
              "From the earliest cave paintings and smoke signals to the modern marvel of real-time video conferencing, the evolution of communication technologies has profoundly shaped human civilization. For millennia, humans relied on rudimentary methods to convey messages, from oral storytelling to carvings etched into stone, each carrying invaluable cultural and historical significance. The invention of writing systems allowed for more permanent records, giving rise to ancient scripts like cuneiform in Mesopotamia and hieroglyphs in Egypt, both revolutionizing administration and storytelling. As societies grew more complex, so did their means of communication, culminating in the development of the printing press by Johannes Gutenberg in the 15th century, which democratized knowledge and accelerated scientific and philosophical progress during the Renaissance. Fast forward to the 19th century, innovations such as the telegraph and telephone collapsed the barriers of distance, allowing for instant communication across continents for the first time in human history. The 20th century ushered in a new era with the advent of radio, television, and eventually, the internet, creating a global web of information and connectivity. In the 21st century, smartphones and social media platforms have turned nearly every individual into both a consumer and a creator of content, transforming how societies interact, conduct business, form relationships, and even protest injustice. Today, artificial intelligence and quantum communication promise to redefine the boundaries of speed, security, and personalization in how we exchange information, but this rapid advancement also raises profound questions about privacy, mental health, misinformation, and the very nature of truth in an increasingly digital and hyperconnected world."
            }
          ></ConfirmationModal>

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
                  Loading discussions...
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
                  Error loading posts: {error}
                </Text>
              </Box>
            </Box>
          )}

          {/* Discussion Posts */}
          {!loading && !error && posts && (
            <Box w="100%" maxW="800px">
              {posts.length === 0 ? (
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
                      No discussions yet
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      Be the first to start a conversation!
                    </Text>
                    <Button
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      color="white"
                      size="md"
                      borderRadius="12px"
                      leftIcon={<MdAdd size={18} />}
                      onClick={() => navigate("/create-post")}
                    >
                      Create First Post
                    </Button>
                  </VStack>
                </Box>
              ) : (
                <Accordion.Root
                  variant="plain"
                  collapsible
                  defaultValue={["0"]}
                >
                  <VStack spacing={4}>
                    {posts.map((post, index) => (
                      <Accordion.Item
                        key={post._id}
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
                          position="relative"
                          _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          {/* Fixed Thread Button */}
                          <Button
                            size="sm"
                            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            color="white"
                            borderRadius="10px"
                            fontWeight="600"
                            p={3}
                            minH="40px"
                            minW="40px"
                            position="absolute"
                            top={4}
                            right={4}
                            zIndex={2}
                            _hover={{
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                            }}
                            transition="all 0.2s ease"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/thread", {
                                state: {
                                  post: {
                                    _id: post._id,
                                    title: post.title,
                                    body: post.body,
                                    createdAt: post.createdAt,
                                    user: post.user,
                                    bibleVerse: post.bibleVerse,
                                  },
                                },
                              });
                            }}
                          >
                            <BiMessageSquareDetail size={18} />
                          </Button>

                          {/* Report Button */}
                          <IconButton
                            aria-label="Report Post"
                            size="sm"
                            variant="ghost"
                            color="gray.500"
                            position="absolute"
                            top={4}
                            right={14}
                            zIndex={2}
                            _hover={{
                              color: "#d69e2e",
                              bg: "rgba(214, 158, 46, 0.1)",
                              transform: "translateY(-1px)",
                            }}
                            transition="all 0.2s ease"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(post);
                              setIsReportModalOpen(true);
                            }}
                          >
                            <MdFlag size={16} />
                          </IconButton>

                          <Accordion.ItemTrigger
                            p={5}
                            pr={20}
                            bg="transparent"
                            _hover={{ bg: "rgba(102, 126, 234, 0.05)" }}
                            transition="all 0.3s ease"
                            onClick={() =>
                              handleAccordionItemClick(post._id, index)
                            }
                          >
                            <VStack w="100%" spacing={4} align="stretch">
                              {/* Main Header - Title */}
                              <VStack spacing={2} align="start" w="100%">
                                <Text
                                  color="gray.800"
                                  fontSize="xl"
                                  fontWeight="700"
                                  lineHeight="1.3"
                                  letterSpacing="-0.025em"
                                >
                                  {getTruncatedTitle(post.title, index)}
                                </Text>

                                {/* Bible Verse Reference - Integrated with title */}
                                {post.bibleVerse &&
                                  post.bibleVerse.reference && (
                                    <HStack spacing={2} align="center">
                                      <Box
                                        w="3px"
                                        h="16px"
                                        bg="#8B4513"
                                        borderRadius="full"
                                      />
                                      <Text
                                        color="#8B4513"
                                        fontSize="sm"
                                        fontWeight="600"
                                        letterSpacing="0.025em"
                                      >
                                        {post.bibleVerse.reference}
                                      </Text>
                                    </HStack>
                                  )}
                              </VStack>

                              {/* Author & Date Section */}
                              <HStack spacing={3} align="center">
                                {/* <Avatar.Root size="sm" borderRadius="8px">
                                  <Avatar.Fallback 
                                    bg="#6B7280" 
                                    color="white"
                                    fontSize="sm"
                                  >
                                    {getAuthorName(post).charAt(0).toUpperCase()}
                                  </Avatar.Fallback>
                                </Avatar.Root> */}
                                <HStack
                                  spacing={0}
                                  align="start"
                                  flex="1"
                                  alignItems="center"
                                >
                                  <Text
                                    color="gray.700"
                                    fontSize="sm"
                                    fontWeight="600"
                                    lineHeight="1.2"
                                  >
                                    {getAuthorName(post)} •
                                  </Text>
                                  <Text
                                    color="gray.500"
                                    fontSize="xs"
                                    lineHeight="1.2"
                                  >
                                    {formatDate(post.createdAt)}
                                  </Text>
                                </HStack>
                              </HStack>

                              {/* Preview Text (only when collapsed) */}
                              {!expandedPosts.has(index.toString()) && (
                                <Box
                                  pl={2}
                                  borderLeft="2px solid rgba(102, 126, 234, 0.1)"
                                >
                                  <Text
                                    color="gray.600"
                                    fontSize="sm"
                                    fontWeight="400"
                                    lineHeight="1.5"
                                    noOfLines={2}
                                    pr={6}
                                  >
                                    {getTruncatedBody(post.body)}
                                  </Text>
                                </Box>
                              )}
                            </VStack>
                          </Accordion.ItemTrigger>
                          <Accordion.ItemContent>
                            <Box px={5} pb={5}>
                              <VStack spacing={3} align="stretch">
                                <Box
                                  w="100%"
                                  h="1px"
                                  bg="rgba(102, 126, 234, 0.1)"
                                />
                                <Box
                                  bg="rgba(102, 126, 234, 0.03)"
                                  borderRadius="10px"
                                  p={4}
                                  border="1px solid rgba(102, 126, 234, 0.1)"
                                >
                                  <Text
                                    color="gray.700"
                                    fontSize="sm"
                                    lineHeight="1.6"
                                    whiteSpace="pre-wrap"
                                  >
                                    {post.body || "No content provided"}
                                  </Text>
                                </Box>
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
                Share your thoughts, ask questions, and engage in meaningful
                discussions with the community.
              </Text>
            </Box>
          )}
        </VStack>

        {/* Report Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          contentType="post"
          contentId={selectedPost?._id}
          contentTitle={selectedPost?.title}
        />
      </Box>
    </>
  );
};

export default Discussion;
