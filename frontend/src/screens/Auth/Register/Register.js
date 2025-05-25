import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../actions/userActions";
import { Button, Stack, Text } from "@chakra-ui/react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
    if(password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(register(firstName, lastName, email, password));
    }
  }

  return (
    <div className="container">
      <Stack>
        <Text textStyle="2xl" fontWeight="bold" fontFamily="Lato">Create an Account</Text> 
        <Text> </Text>
      </Stack> 
      <div className="formContainer">
      <input
          className="formInput"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="formInput"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
        <input
          className="formInput"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="buttonsContainer">
        <Button size="lg" width="250px" colorPalette={"purple"} rounded={"full"} onClick={() => onRegisterHandle()}>
          Register
        </Button>      
        <div className="loginText">
          <span fontFamily="Lato">Have an account? </span> 
          <span fontFamily="Lato" className="loginLink" onClick={() => navigate("/")}>Log In </span>
        </div>
        {message && <ErrorMessage> {message} </ErrorMessage>}
      </div>
    </div>
  );
};

export default Register;
