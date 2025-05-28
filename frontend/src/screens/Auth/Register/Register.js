import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../actions/userActions";
import { Box, Button, Input, VStack, Text, Heading } from "@chakra-ui/react";
import EULA from "../../../components/EULA/EULA";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [eulaAccepted, setEulaAccepted] = useState(false);

  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userRegister = useSelector(state => state.userRegister);
  const {loading, error, userInfo } = userRegister;

  useEffect(() => {
    if(userInfo) {
        navigate("/home");
    }
  }, [userInfo, navigate])

  const onRegisterHandle = async () => {
    if (!eulaAccepted) {
      return;
    }
    if(password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      dispatch(register(firstName, lastName, email, password));
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && eulaAccepted) {
      onRegisterHandle();
    }
  }

  const handleEulaAccept = (accepted) => {
    setEulaAccepted(accepted);
  }

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={{ base: 4, md: 5 }}
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      <Box
        bg="rgba(255, 255, 255, 0.95)"
        borderRadius={{ base: "20px", md: "24px" }}
        p={{ base: 8, md: 12 }}
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
        backdropFilter="blur(20px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        w="100%"
        maxW="400px"
        textAlign="center"
      >
        <VStack spacing={8} w="100%">
          <Box>
            <Heading
              size="xl"
              bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
              bgClip="text"
              mb={2}
            >
              Join AAIV
            </Heading>
            <Text color="gray.600" fontSize="md">
              Create your AAIV account
            </Text>
          </Box>

          <VStack spacing={5} w="100%">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="given-name"
              size="lg"
              borderRadius="12px"
              border="2px solid rgba(102, 126, 234, 0.1)"
              bg="rgba(255, 255, 255, 0.8)"
              color="gray.800"
              _focus={{
                borderColor: "#667eea",
                bg: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                transform: "translateY(-2px)"
              }}
              _placeholder={{ color: "gray.500" }}
              transition="all 0.3s ease"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="family-name"
              size="lg"
              borderRadius="12px"
              border="2px solid rgba(102, 126, 234, 0.1)"
              bg="rgba(255, 255, 255, 0.8)"
              color="gray.800"
              _focus={{
                borderColor: "#667eea",
                bg: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                transform: "translateY(-2px)"
              }}
              _placeholder={{ color: "gray.500" }}
              transition="all 0.3s ease"
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="email"
              size="lg"
              borderRadius="12px"
              border="2px solid rgba(102, 126, 234, 0.1)"
              bg="rgba(255, 255, 255, 0.8)"
              color="gray.800"
              _focus={{
                borderColor: "#667eea",
                bg: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                transform: "translateY(-2px)"
              }}
              _placeholder={{ color: "gray.500" }}
              transition="all 0.3s ease"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="new-password"
              size="lg"
              borderRadius="12px"
              border="2px solid rgba(102, 126, 234, 0.1)"
              bg="rgba(255, 255, 255, 0.8)"
              color="gray.800"
              _focus={{
                borderColor: "#667eea",
                bg: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                transform: "translateY(-2px)"
              }}
              _placeholder={{ color: "gray.500" }}
              transition="all 0.3s ease"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="new-password"
              size="lg"
              borderRadius="12px"
              border="2px solid rgba(102, 126, 234, 0.1)"
              bg="rgba(255, 255, 255, 0.8)"
              color="gray.800"
              _focus={{
                borderColor: "#667eea",
                bg: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
                transform: "translateY(-2px)"
              }}
              _placeholder={{ color: "gray.500" }}
              transition="all 0.3s ease"
            />
          </VStack>

          <VStack spacing={5} w="100%">
            <EULA onAccept={handleEulaAccept} isAccepted={eulaAccepted} />
            
            <Button
              onClick={onRegisterHandle}
              isLoading={loading}
              loadingText="Creating account..."
              disabled={loading || !eulaAccepted}
              size="lg"
              w="100%"
              h="56px"
              fontSize="16px"
              fontWeight="600"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              borderRadius="12px"
              boxShadow="0 4px 20px rgba(102, 126, 234, 0.3)"
              _hover={{
                transform: !eulaAccepted ? "none" : "translateY(-2px)",
                boxShadow: !eulaAccepted ? "0 4px 20px rgba(102, 126, 234, 0.3)" : "0 8px 30px rgba(102, 126, 234, 0.4)",
                _disabled: { transform: "none" }
              }}
              _active={{
                transform: "translateY(0)"
              }}
              _disabled={{
                opacity: 0.7,
                cursor: "not-allowed"
              }}
              transition="all 0.3s ease"
            >
              Create Account
            </Button>
            
            <Text fontSize="sm" color="gray.600">
              Already have an account?{" "}
              <Text
                as="span"
                color="#667eea"
                fontWeight="600"
                cursor="pointer"
                _hover={{ color: "#764ba2", textDecoration: "underline" }}
                onClick={() => navigate("/")}
                transition="all 0.3s ease"
              >
                Sign in here
              </Text>
            </Text>
            
            {(message || error) && (
              <Box
                mt={4}
                p={3}
                bg="rgba(255, 59, 48, 0.1)"
                border="1px solid rgba(255, 59, 48, 0.2)"
                borderRadius="8px"
                color="red.600"
                fontSize="sm"
                textAlign="center"
                w="100%"
              >
                {message || error}
              </Box>
            )}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;
