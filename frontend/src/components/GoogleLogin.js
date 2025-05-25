import React from 'react';
import { Button } from '@chakra-ui/react';

function GoogleLogin() {
  const handleLoginClick = () => {
    window.location.href = 'http://localhost:5001/api/google';
  };

  return (
    <Button colorScheme = 'blue' onClick={handleLoginClick}>
      Login with Google Calendar
    </Button>
  );
}

export default GoogleLogin;