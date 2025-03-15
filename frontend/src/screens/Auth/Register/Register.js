import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../actions/userActions";

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
      <h2>AAIV Register</h2> 
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
        <div className="registerButton" onClick={() => onRegisterHandle()}>
          Register
        </div>
        <div className="loginText">
          <span>Have an account?</span> 
          <span className="loginLink" onClick={() => navigate("/")}> Log In </span>
        </div>
        {message && <ErrorMessage> {message} </ErrorMessage>}
      </div>
    </div>
  );
};

export default Register;
