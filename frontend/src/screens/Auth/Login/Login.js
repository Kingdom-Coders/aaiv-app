import "./Login.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../actions/userActions";
import { Button, Stack, Text} from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    dispatch(login(email, password));
  }

  return (
    <div className="container">
      <Stack>
        <Text textStyle="2xl" fontWeight="bold" fontFamily="Lato">AAIV Login</Text> 
        <Text> </Text>
      </Stack>
      <div className="formContainer">
        <input
          className="formInput"
          type="text"
          placeholder="Email/Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="formInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="buttonsContainer">
        <Button size="lg" width="250px" colorPalette={"purple"} rounded={"full"} onClick={() => loginHandler()}>
          Login
        </Button>
        <div className="registerText">
          <span>Don't have an account? </span> 
          <span className="registerLink" onClick={() => navigate("/register")}>Register</span>
        </div>
        {error && <ErrorMessage> {error} </ErrorMessage>}
      </div>
    </div>
  );
};

export default Login;
