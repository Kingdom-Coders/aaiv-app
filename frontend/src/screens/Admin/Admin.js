import React from 'react';
import UserList from '../../components/UserList';
import './Admin.css';

const Admin = () => {
  return (
    <div className="admin-screen">
      <h1>Admin Screen</h1>
      <UserList />
    </div>
  );
};

export default Admin;