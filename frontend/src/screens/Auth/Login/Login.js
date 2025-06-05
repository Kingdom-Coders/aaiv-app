import "./Login.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../actions/userActions";
import { Box, Button, Input, VStack, Text, Heading } from "@chakra-ui/react";
import EULA from "../../../components/EULA/EULA";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eulaAccepted, setEulaAccepted] = useState(false);

  // Navigation hook for routes
  const navigate = useNavigate();

  // Dispatch hook from redux 
  const dispatch = useDispatch();
  
  // UseSelector grabs the state from the entire redux state (Rerenders when the state updates)
  // state.userLogin grabs just the userLogin part (in our store.js this points to a loginReducer)
  const userLogin = useSelector((state) => state.userLogin);
  // Destructures the relevant information
  const { loading, error, userInfo } = userLogin;
  
  useEffect(() => {
    if(userInfo) {
        navigate("/home");
    }
  }, [navigate, userInfo])

  // Called when login button is clicked
  const loginHandler = async () => {
    if (!eulaAccepted) {
      return;
    }
    dispatch(login(email, password));
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && eulaAccepted) {
      loginHandler();
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
              Welcome Back
            </Heading>
            <Text color="gray.600" fontSize="md">
              Sign in to AAIV app
            </Text>
          </Box>

          <VStack spacing={5} w="100%">
            <Input
              type="email"
              placeholder="Email or Username"
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
              autoComplete="current-password"
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
              onClick={loginHandler}
              isLoading={loading}
              loadingText="Signing in..."
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
              Sign In
            </Button>
            
            <Text fontSize="sm" color="gray.600">
              Don't have an account?{" "}
              <Text
                as="span"
                color="#667eea"
                fontWeight="600"
                cursor="pointer"
                _hover={{ color: "#764ba2", textDecoration: "underline" }}
                onClick={() => navigate("/register")}
                transition="all 0.3s ease"
              >
                Create one here
              </Text>
            </Text>

            <Text fontSize="sm" color="gray.600">
              Want to explore first?{" "}
              <Text
                as="span"
                color="#667eea"
                fontWeight="600"
                cursor="pointer"
                _hover={{ color: "#764ba2", textDecoration: "underline" }}
                onClick={() => navigate("/")}
                transition="all 0.3s ease"
              >
                Browse as Guest
              </Text>
            </Text>
            
            {error && (
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
                {error}
              </Box>
            )}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
