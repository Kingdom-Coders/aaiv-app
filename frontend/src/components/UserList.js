import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, listUsers } from '../actions/userActions';
import "./UserList.css"


function UserList() {
    const dispatch = useDispatch();

    const userList = useSelector((state) => state.userList);
    const {loading, users, error} = userList;

    const userDelete = useSelector((state) => state.userDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = userDelete;

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(id)); 
        }
    };

    useEffect(() => {
        dispatch(listUsers()); // Fetch users when component loads
    }, [dispatch, successDelete]);

  return (
        <div className="admin-container">
            <h2 className="admin-title">Admin Panel - User List</h2>
            {loading ? (
                <p className="loading-message">Loading users...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Delete</th>
                                {/* <th>Promote</th> */}
                            </tr>
                        </thead>
                        <tbody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? "Admin" : "User"}</td>
                                <td>{user.isAdmin ? "" : <div className="deleteButton" onClick={() => handleDelete(user._id)}>X</div>}</td>
                                {/* <td>{!user.isAdmin ? <div className="promoteButton" onClick={() => handlePromote(user._id)}>X</div> : ""}</td> */}
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="4">No users found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
  )
}

export default UserList