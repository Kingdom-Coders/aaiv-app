import {
  Box,
  HStack,
  Heading,
  Text,
  Button,
  VStack,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoWarningOutline, IoInformationCircleOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  type,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  // Left these here in case it's needed in the future
  const dispatch = useDispatch();
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reportCreate = useSelector((state) => state.reportCreate);
  const { loading, success, error } = reportCreate;
  const ref = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen) return null;

  // Default values based on type of confirmation
  const defaults = {
    delete: {
      color: "red.500",
      hover: "red.600",
      message: "Are you sure you want to delete? This action cannot be undone.",
      title: "Delete",
      confirmText: "I understand, delete",
      cancelText: "Cancel",
      icon: <AiOutlineDelete size={23} />,
    },
    warning: {
      color: "yellow.600",
      hover: "yellow.700",
      message: "Are you sure you want to continue?",
      title: "Warning",
      confirmText: "Yes, Continue",
      cancelText: "Cancel",
      icon: <IoWarningOutline size={23} />,
    },
    info: {
      color: "blue.500",
      hover: "blue.600",
      message: "This is just a head's up",
      title: "Info",
      confirmText: "Okay",
      cancelText: "Cancel",
      icon: <IoInformationCircleOutline size={23} />,
    },
  };

  // If the type is not one of the 3 in defaults
  if (defaults[type] === undefined) {
    alert("No such type of modal");
    onCancel();
  }

  // Handles closing of modal, possibly put shifting focus back to trigger element here
  const handleClose = (confirmed) => {
    confirmed ? onConfirm() : onCancel();
  };

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
          onCancel();
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
        ref={ref}
      >
        {/* Header */}
        <Box
          p={6}
          borderBottom="1px solid"
          borderColor="gray.200"
          position="sticky"
          top="0"
          bg={defaults[type]["color"]}
          borderTopRadius="16px"
        >
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon>{defaults[type]["icon"]}</Icon>
              <Box>
                <Heading size="md" color="white">
                  {title ? title : defaults[type]["title"]}
                </Heading>
              </Box>
            </HStack>
          </HStack>
        </Box>

        {/* Content */}
        <Box p={6}>
          <VStack spacing={6} align="stretch">
            {/* Content Info */}
            <Text fontSize="sm" color="gray.600" mb={4}>
              {message ? message : defaults[type]["message"]}
            </Text>

            {/* Action Buttons */}
            <HStack spacing={3} justify="flex-end">
              <Button
                variant="ghost"
                onClick={() => handleClose(false)}
                color="gray.600"
                _hover={{ bg: "gray.100" }}
                disabled={loading}
              >
                {cancelText ? cancelText : defaults[type]["cancelText"]}
              </Button>
              <Button
                bg={defaults[type]["color"]}
                color="white"
                _hover={{ bg: defaults[type]["hover"] }}
                onClick={() => handleClose(true)}
                disabled={loading}
                leftIcon={loading ? <Spinner size="sm" /> : <></>}
              >
                {loading
                  ? "Submitting..."
                  : confirmText
                  ? confirmText
                  : defaults[type]["confirmText"]}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmationModal;
