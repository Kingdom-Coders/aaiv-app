import "./Login.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../actions/userActions";
import { Button } from "@chakra-ui/react";

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
      <h2>AAIV</h2> 
      <div className="formContainer">
        <input
          className="formInput"
          type="text"
          placeholder="Email"
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
        <Button size="lg" colorPalette={"purple"} rounded={"full"} onClick={() => loginHandler()}>
          Login
        </Button>
        <div className="registerText">
          <span>Don't have an account?</span> 
          <span className="registerLink" onClick={() => navigate("/register")}> Register</span>
        </div>
        {error && <ErrorMessage> {error} </ErrorMessage>}
      </div>
    </div>
  );
};

export default Login;
