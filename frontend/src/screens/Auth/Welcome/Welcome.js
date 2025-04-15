import React from 'react';
import './Welcome.css';
import { useNavigate } from "react-router-dom";
import { Stack, Text } from "@chakra-ui/react";


const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
        
            <div className="welcome-content">
            <Stack>
                <Text textStyle="2xl" fontWeight="bold" center>Welcome to Helloship!</Text> 
            </Stack> 

            <div className="button-group">
                <span className="welcome-button login-button" onClick={() => navigate("/login")}>
                Login
                </span>
                <span className="welcome-button register-button" onClick={() => navigate("/register")}>
                Register
                </span>
            </div>
            </div>
        </div>
    );
};

export default Welcome;