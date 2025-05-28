import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Textarea,
  Spinner,
} from '@chakra-ui/react';
import { MdClose, MdFlag } from 'react-icons/md';
import { createReportAction, resetReportCreate } from '../actions/reportActions';

const ReportModal = ({ isOpen, onClose, contentType, contentId, contentTitle }) => {
  const dispatch = useDispatch();
  const [reportReason, setReportReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reportCreate = useSelector((state) => state.reportCreate);
  const { loading, success, error } = reportCreate;

  const reportReasons = [
    { value: 'spam', label: 'Spam or unwanted content' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'inappropriate', label: 'Inappropriate content' },
    { value: 'misinformation', label: 'False or misleading information' },
    { value: 'hate_speech', label: 'Hate speech or discrimination' },
    { value: 'violence', label: 'Violence or threats' },
    { value: 'copyright', label: 'Copyright violation' },
    { value: 'other', label: 'Other (please specify)' },
  ];

  const handleSubmit = () => {
    if (!reportReason) {
      alert('Please select a reason for reporting');
      return;
    }

    if (reportReason === 'other' && !customReason.trim()) {
      alert('Please provide a custom reason');
      return;
    }

    const reportData = {
      contentType,
      contentId,
      reason: reportReason,
      customReason: reportReason === 'other' ? customReason.trim() : '',
      description: reportReason === 'other' ? customReason.trim() : reportReasons.find(r => r.value === reportReason)?.label || '',
    };

    dispatch(createReportAction(reportData));
  };

  // Close modal and reset form when report is successful
  React.useEffect(() => {
    if (success) {
      // Show success message
      alert('Report submitted successfully');
      
      // Reset form state
      setReportReason('');
      setCustomReason('');
      
      // Close modal after a longer delay to ensure the report is processed
      setTimeout(() => {
        onClose();
        // Reset Redux state after closing
        dispatch(resetReportCreate());
      }, 500);
    }
  }, [success, onClose, dispatch]);

  // Also reset state when modal is closed manually
  const handleClose = () => {
    onClose();
    // Only reset if not currently submitting
    if (!loading) {
      dispatch(resetReportCreate());
    }
    // Reset form state
    setReportReason('');
    setCustomReason('');
  };

  if (!isOpen) return null;

  return (
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
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          handleClose();
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
          position="sticky"
          top="0"
          bg="white"
          borderTopRadius="16px"
        >
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Box
                p={2}
                bg="red.50"
                borderRadius="8px"
                color="red.500"
              >
                <MdFlag size={20} />
              </Box>
              <Box>
                <Heading size="md" color="gray.800">
                  Report Content
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Help us keep the community safe
                </Text>
              </Box>
            </HStack>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              color="gray.500"
              _hover={{ color: "gray.700", bg: "gray.100" }}
            >
              <MdClose size={20} />
            </Button>
          </HStack>
        </Box>

        {/* Content */}
        <Box p={6}>
          <VStack spacing={6} align="stretch">
            {/* Content Info */}
            <Box
              bg="gray.50"
              borderRadius="12px"
              p={4}
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="sm" color="gray.600" mb={1}>
                Reporting {contentType}:
              </Text>
              <Text fontSize="sm" fontWeight="600" color="gray.800" noOfLines={2}>
                {contentTitle || `${contentType} content`}
              </Text>
            </Box>

            {/* Report Reasons */}
            <Box>
              <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
                Why are you reporting this content?
              </Text>
              <VStack spacing={3} align="stretch">
                {reportReasons.map((reason) => (
                  <Box
                    key={reason.value}
                    p={3}
                    borderRadius="8px"
                    border="1px solid"
                    borderColor={reportReason === reason.value ? "red.300" : "gray.200"}
                    bg={reportReason === reason.value ? "red.50" : "white"}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "red.300",
                      bg: "red.50",
                    }}
                    onClick={() => setReportReason(reason.value)}
                  >
                    <HStack spacing={3}>
                      <Box
                        w={4}
                        h={4}
                        borderRadius="50%"
                        border="2px solid"
                        borderColor={reportReason === reason.value ? "red.500" : "gray.300"}
                        bg={reportReason === reason.value ? "red.500" : "white"}
                        position="relative"
                      >
                        {reportReason === reason.value && (
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            w={2}
                            h={2}
                            bg="white"
                            borderRadius="50%"
                          />
                        )}
                      </Box>
                      <Text fontSize="sm" color="gray.700">
                        {reason.label}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Custom Reason Input */}
            {reportReason === 'other' && (
              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.800" mb={2}>
                  Please specify the reason:
                </Text>
                <Textarea
                  placeholder="Describe why you're reporting this content..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  borderRadius="8px"
                  border="1px solid"
                  borderColor="gray.300"
                  bg="white"
                  color="gray.800"
                  fontSize="sm"
                  p={3}
                  rows={3}
                  resize="vertical"
                  _focus={{
                    borderColor: "red.400",
                    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
                  }}
                  _placeholder={{ color: "gray.500" }}
                />
              </Box>
            )}

            {/* Error Message */}
            {error && (
              <Box
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="8px"
                p={3}
              >
                <Text color="red.600" fontSize="sm">
                  {error}
                </Text>
              </Box>
            )}

            {/* Action Buttons */}
            <HStack spacing={3} justify="flex-end">
              <Button
                variant="ghost"
                onClick={handleClose}
                color="gray.600"
                _hover={{ bg: "gray.100" }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600" }}
                onClick={handleSubmit}
                disabled={loading || !reportReason}
                leftIcon={loading ? <Spinner size="sm" /> : <MdFlag size={16} />}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportModal; 