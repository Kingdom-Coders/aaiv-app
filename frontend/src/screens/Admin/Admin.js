import React from 'react';
import UserList from '../../components/UserList';
import './Admin.css';
import { Button, ButtonGroup } from "@chakra-ui/react"
import { Heading } from "@chakra-ui/react"
import { Input } from "@chakra-ui/react"
import { Textarea } from "@chakra-ui/react"

const Admin = () => {
  return (
    <div className="admin-screen">
      <h1 className="titleText">Admin Screen</h1>
      <UserList />
      <div className="announcement-post">
        <div className="announcement-title">
          <h1>Announcement</h1>
        </div>
        <h2> Title </h2>
        <Input style={{
          marginBottom: '5%'
        }}/>
        <h2> Body </h2>
        <div className="text-area">
          <Textarea  style={{
          marginBottom: '5%'
          }}/>
        </div>
        <div className="button">
          <Button> Post </Button>
        </div>
        </div>

        </div>
  );
};

export default Admin;