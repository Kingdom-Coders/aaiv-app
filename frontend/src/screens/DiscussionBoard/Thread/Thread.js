// hello world
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Avatar,
  Separator,
  Textarea,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { MdArrowBack, MdChatBubbleOutline, MdSend, MdMenuBook, MdDelete, MdFlag } from "react-icons/md";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { listComments, createCommentAction } from "../../../actions/commentActions";
import { deletePostAction } from "../../../actions/postActions";
import { resetReportCreate } from "../../../actions/reportActions";
import ReportModal from "../../../components/ReportModal";
import { 
  DrawerRoot, 
  DrawerContent, 
  DrawerHeader, 
  DrawerBody, 
  DrawerCloseTrigger 
} from "../../../components/ui/drawer";
import usePullToRefresh from "../../../hooks/usePullToRefresh";
import PullToRefreshIndicator from "../../../components/PullToRefreshIndicator";

const Thread = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState({ contentType: '', contentId: '', contentTitle: '' });

  // Local state for comment form
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  
  // Get post data from navigation state, with fallback
  const postData = location.state?.post || {
    _id: "fallback",
    title: "Sample Discussion Post",
    body: "This is a sample post for demonstration purposes.",
    createdAt: new Date().toISOString(),
    user: "Unknown User"
  };

  // Redux state
  const commentList = useSelector((state) => state.commentList);
  const { loading, error, comments } = commentList;

  const commentCreate = useSelector((state) => state.commentCreate);
  const { loading: createLoading, success: createSuccess } = commentCreate;

  const postDelete = useSelector((state) => state.postDelete);
  const { loading: deleteLoading, success: deleteSuccess } = postDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Pull-to-refresh functionality
  const {
    isPulling,
    isRefreshing,
    pullDistance,
    refreshProgress
  } = usePullToRefresh(() => {
    if (userInfo && postData._id !== "fallback") {
      dispatch(listComments(postData._id));
    }
  });

  // Fetch comments when component mounts or when a comment is created
  useEffect(() => {
    if (userInfo && postData._id !== "fallback") {
      dispatch(listComments(postData._id));
    }
  }, [dispatch, userInfo, postData._id, createSuccess]);

  // Clean up report state when component unmounts
  useEffect(() => {
    return () => {
      // Only reset report state if there's no active submission
      const reportCreate = commentCreate; // Use existing selector pattern
      if (!reportCreate?.loading) {
        dispatch(resetReportCreate());
      }
    };
  }, [dispatch]);

  // Handle successful post deletion
  useEffect(() => {
    if (deleteSuccess) {
      navigate("/discussion");
    }
  }, [deleteSuccess, navigate]);

  // Check if current user owns the post
  const isPostOwner = () => {
    if (!userInfo || !postData.user) return false;
    
    // Handle both string ID and object user
    const postUserId = typeof postData.user === 'object' ? postData.user._id : postData.user;
    return userInfo._id === postUserId;
  };

  // Handle delete post action
  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      dispatch(deletePostAction(postData._id));
    }
  };

  // Date formatting functions
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec",
  ];

  const dateFormatter = (date) => {
    const now = new Date();
    const givenDate = new Date(date);

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper functions
  const getAuthorName = (comment) => {
    if (comment.user && typeof comment.user === 'object') {
      if (comment.user.firstName && comment.user.lastName) {
        return `${comment.user.firstName} ${comment.user.lastName}`;
      } else if (comment.user.firstName) {
        return comment.user.firstName;
      } else if (comment.user.lastName) {
        return comment.user.lastName;
      }
    }
    return 'Unknown User';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Comment submission handlers
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    dispatch(createCommentAction(postData._id, newComment.trim()));
    setNewComment("");
  };

  const handleReplySubmit = (parentCommentId) => {
    if (!replyText.trim()) return;
    
    dispatch(createCommentAction(postData._id, replyText.trim(), parentCommentId));
    setReplyText("");
    setReplyingTo(null);
  };

  const handleKeyPress = (e, isReply = false, parentCommentId = null) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      if (isReply) {
        handleReplySubmit(parentCommentId);
      } else {
        handleCommentSubmit();
      }
    }
  };

  // Organize comments into threads (main comments and their replies)
  const organizeComments = (comments) => {
    const mainComments = comments.filter(comment => !comment.parentComment);
    const replies = comments.filter(comment => comment.parentComment);
    
    return mainComments.map(mainComment => ({
      ...mainComment,
      replies: replies.filter(reply => 
        reply.parentComment && reply.parentComment._id === mainComment._id
      )
    }));
  };

  const organizedComments = comments ? organizeComments(comments) : [];

  // Enhanced close handler for report modal
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportModalData({ contentType: '', contentId: '', contentTitle: '' });
    // Don't reset here - let the ReportModal handle its own state management
  };

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
        <VStack spacing={6} maxW="800px" mx="auto" mt={10}>
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
                {postData.title}
              </Heading>
              <Text color="gray.600" fontSize="sm" mt={1}>
                Discussion Thread
              </Text>
            </Box>
            {/* Bible Verse Button */}
            {postData.bibleVerse && (
              <IconButton
                aria-label="View Bible Verse"
                variant="ghost"
                size="md"
                color="gray.600"
                _hover={{ 
                  color: "#667eea", 
                  bg: "rgba(102, 126, 234, 0.1)" 
                }}
                onClick={() => setIsDrawerOpen(true)}
              >
                <MdMenuBook size={20} />
              </IconButton>
            )}
            
            {/* Delete/Report Button */}
            {isPostOwner() ? (
              <IconButton
                aria-label="Delete Post"
                variant="ghost"
                size="md"
                color="gray.600"
                _hover={{ 
                  color: "#e53e3e", 
                  bg: "rgba(229, 62, 62, 0.1)" 
                }}
                onClick={handleDeletePost}
                isLoading={deleteLoading}
              >
                <MdDelete size={20} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="Report Post"
                variant="ghost"
                size="md"
                color="gray.600"
                _hover={{ 
                  color: "#d69e2e", 
                  bg: "rgba(214, 158, 46, 0.1)" 
                }}
                onClick={() => {
                  setReportModalData({
                    contentType: 'post',
                    contentId: postData._id,
                    contentTitle: postData.title
                  });
                  setIsReportModalOpen(true);
                }}
              >
                <MdFlag size={20} />
              </IconButton>
            )}
            
            <Box
              bg="rgba(102, 126, 234, 0.1)"
              color="#667eea"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="500"
            >
              {formatDate(postData.createdAt)}
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
                Post Content:
              </Text>
              <Box
                bg="rgba(102, 126, 234, 0.05)"
                borderRadius="12px"
                p={4}
              >
                <Text 
                  color="gray.700" 
                  fontSize="sm" 
                  lineHeight="1.6"
                  whiteSpace="pre-wrap"
                >
                  {postData.body || 'No content provided'}
                </Text>
              </Box>
              <Text
                color="gray.500"
                fontSize="xs"
                textAlign="right"
              >
                Posted {formatDate(postData.createdAt)}
              </Text>
            </VStack>
          </Box>

          {/* Add Comment Form */}
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
              >
                Add a Comment
              </Text>
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
                borderRadius="12px"
                border="2px solid rgba(102, 126, 234, 0.1)"
                bg="rgba(255, 255, 255, 0.8)"
                color="gray.800"
                fontSize="sm"
                p={3}
                rows={3}
                resize="vertical"
                _focus={{
                  borderColor: "#667eea",
                  bg: "rgba(255, 255, 255, 1)",
                  boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                }}
                _placeholder={{ color: "gray.500" }}
              />
              <HStack justify="space-between">
                <Text
                  color="gray.500"
                  fontSize="xs"
                >
                  Tip: Press Ctrl+Enter to submit
                </Text>
                <Button
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  size="sm"
                  borderRadius="8px"
                  leftIcon={<MdSend size={16} />}
                  onClick={handleCommentSubmit}
                  isLoading={createLoading}
                  isDisabled={!newComment.trim()}
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  Comment
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Help Text */}
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
              Join the conversation by sharing your thoughts and insights.
            </Text>
          </Box>

          {/* Comments Section */}
          <Box w="100%">
            {/* Loading State */}
            {loading && (
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
                  <Spinner size="lg" color="#667eea" />
                  <Text color="gray.600" fontSize="md">
                    Loading comments...
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
                    Error loading comments: {error}
                  </Text>
                </Box>
              </Box>
            )}

            {/* Comments Display */}
            {!loading && !error && (
              <VStack spacing={4}>
                {organizedComments.length > 0 ? (
                  organizedComments.map((comment) => (
                    <Box
                      key={comment._id}
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
                      {/* Main Comment */}
                      <Box p={6}>
                        <HStack spacing={4} align="flex-start" mb={4}>
                          <Avatar.Root size="md" borderRadius="10px">
                            <Avatar.Fallback
                              name={getInitials(getAuthorName(comment))}
                              // bg="#6B7280"
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
                                {getAuthorName(comment)}
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
                                {dateFormatter(comment.createdAt)}
                              </Box>
                            </HStack>
                            <Text
                              color="gray.700"
                              fontSize="sm"
                              lineHeight="1.6"
                              mb={3}
                              whiteSpace="pre-wrap"
                            >
                              {comment.body}
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
                                onClick={() => setReplyingTo(comment._id)}
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
                                onClick={() => {
                                  setReportModalData({
                                    contentType: 'comment',
                                    contentId: comment._id,
                                    contentTitle: `Comment by ${getAuthorName(comment)}`
                                  });
                                  setIsReportModalOpen(true);
                                }}
                              >
                                Report
                              </Button>
                            </HStack>
                          </Box>
                        </HStack>

                        {/* Reply Form */}
                        {replyingTo === comment._id && (
                          <Box
                            mt={4}
                            p={4}
                            bg="rgba(102, 126, 234, 0.05)"
                            borderRadius="12px"
                          >
                            <VStack spacing={3} align="stretch">
                              <Text
                                color="gray.700"
                                fontSize="sm"
                                fontWeight="500"
                              >
                                Reply to {getAuthorName(comment)}
                              </Text>
                              <Textarea
                                placeholder="Write your reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, true, comment._id)}
                                borderRadius="8px"
                                border="2px solid rgba(102, 126, 234, 0.1)"
                                bg="white"
                                color="gray.800"
                                fontSize="sm"
                                p={3}
                                rows={2}
                                _focus={{
                                  borderColor: "#667eea",
                                  boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                                }}
                              />
                              <HStack justify="flex-end" spacing={2}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  color="gray.600"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                  color="white"
                                  leftIcon={<MdSend size={14} />}
                                  onClick={() => handleReplySubmit(comment._id)}
                                  isLoading={createLoading}
                                  isDisabled={!replyText.trim()}
                                >
                                  Reply
                                </Button>
                              </HStack>
                            </VStack>
                          </Box>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <Box>
                            <Separator mb={4} />
                            <VStack spacing={4} align="stretch">
                              {comment.replies.map((reply) => (
                                <Box
                                  key={reply._id}
                                  pl={8}
                                  borderLeft="2px solid"
                                  borderColor="rgba(102, 126, 234, 0.2)"
                                >
                                  <HStack spacing={3} align="flex-start">
                                    <Avatar.Root size="sm" borderRadius="8px">
                                      <Avatar.Fallback
                                        name={getInitials(getAuthorName(reply))}
                                        // bg="#6B7280"
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
                                          {getAuthorName(reply)}
                                        </Text>
                                        <Text
                                          color="gray.500"
                                          fontSize="xs"
                                        >
                                          {dateFormatter(reply.createdAt)}
                                        </Text>
                                      </HStack>
                                      <Text
                                        color="gray.600"
                                        fontSize="sm"
                                        lineHeight="1.5"
                                        mb={2}
                                        whiteSpace="pre-wrap"
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
                                          onClick={() => setReplyingTo(comment._id)}
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
                                          onClick={() => {
                                            setReportModalData({
                                              contentType: 'comment',
                                              contentId: reply._id,
                                              contentTitle: `Reply by ${getAuthorName(reply)}`
                                            });
                                            setIsReportModalOpen(true);
                                          }}
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
            )}
          </Box>
        </VStack>

        {/* Bible Verse Sidebar */}
        <DrawerRoot 
          open={isDrawerOpen} 
          onOpenChange={(e) => setIsDrawerOpen(e.open)}
          placement="end"
          size="md"
        >
          <DrawerContent pt="max(60px, env(safe-area-inset-top) + 40px)">
            <DrawerCloseTrigger 
              onClick={() => setIsDrawerOpen(false)}
              position="absolute"
              top="max(60px, env(safe-area-inset-top) + 30px)"
              right="20px"
              zIndex={10}
              bg="rgba(255, 255, 255, 0.9)"
              borderRadius="50%"
              w="40px"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
              _hover={{
                bg: "rgba(255, 255, 255, 1)",
                transform: "scale(1.05)"
              }}
            />
            <DrawerHeader pt={4}>
              <HStack spacing={2}>
                <MdMenuBook size={24} color="#667eea" />
                <Text color="gray.800" fontWeight="600">
                  Bible Verse
                </Text>
              </HStack>
            </DrawerHeader>
            <DrawerBody>
              {postData.bibleVerse ? (
                <VStack spacing={6} align="stretch" pt={4}>
                  {/* Reference */}
                  <Box>
                    <Text
                      color="gray.600"
                      fontSize="sm"
                      fontWeight="500"
                      mb={2}
                    >
                      Reference
                    </Text>
                    <Box
                      bg="rgba(102, 126, 234, 0.1)"
                      borderRadius="12px"
                      p={4}
                    >
                      <Text
                        color="#667eea"
                        fontSize="lg"
                        fontWeight="600"
                      >
                        {postData.bibleVerse.reference}
                      </Text>
                    </Box>
                  </Box>

                  {/* Translation */}
                  <Box>
                    <Text
                      color="gray.600"
                      fontSize="sm"
                      fontWeight="500"
                      mb={2}
                    >
                      Translation
                    </Text>
                    <Text
                      color="gray.700"
                      fontSize="md"
                      fontWeight="500"
                    >
                      {postData.bibleVerse.translation || 'WEB'}
                    </Text>
                  </Box>

                  {/* Verse Text */}
                  <Box>
                    <Text
                      color="gray.600"
                      fontSize="sm"
                      fontWeight="500"
                      mb={2}
                    >
                      Verse
                    </Text>
                    <Box
                      bg="gray.50"
                      borderRadius="12px"
                      p={6}
                      border="1px solid rgba(102, 126, 234, 0.1)"
                    >
                      <Text
                        color="gray.800"
                        fontSize="md"
                        lineHeight="1.8"
                        fontStyle="italic"
                      >
                        "{postData.bibleVerse.text || 'Verse text not available'}"
                      </Text>
                    </Box>
                  </Box>

                  {/* Footer */}
                  <Box
                    bg="rgba(102, 126, 234, 0.05)"
                    borderRadius="12px"
                    p={4}
                    mt={4}
                  >
                    <Text
                      color="gray.600"
                      fontSize="sm"
                      textAlign="center"
                    >
                      This verse was shared to support the discussion
                    </Text>
                  </Box>
                </VStack>
              ) : (
                <Box textAlign="center" pt={8}>
                  <Text color="gray.500" fontSize="md">
                    No Bible verse associated with this post
                  </Text>
                </Box>
              )}
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>

        {/* Report Modal */}
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          contentType={reportModalData.contentType}
          contentId={reportModalData.contentId}
          contentTitle={reportModalData.contentTitle}
        />
      </Box>
    </>
  );
};

export default Thread;
