import './App.css';

// Authentication screens
import Welcome from './screens/Auth/Welcome/Welcome';
import Login from "./screens/Auth/Login/Login";
import Register from "./screens/Auth/Register/Register";
import PrivateRoute from "./screens/Auth/PrivateRoute";

// Main application screens
import Home from "./screens/Home/Home";
import Discussion from "./screens/DiscussionBoard/Discussion/Discussion";
import CreatePost from "./screens/DiscussionBoard/CreatePost/CreatePost";
import Thread from "./screens/DiscussionBoard/Thread/Thread";
import Events from "./screens/Events/Events";
import ChatLink from "./screens/ChatLink/ChatLink";
import Admin from "./screens/Admin/Admin";
import Profile from "./screens/Profile/Profile";

// Components
import NavBar from "./components/NavBar/NavBar";

// React Router and Redux
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  // Get user authentication state from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/discussion"
          element={
            <PrivateRoute>
              <Discussion />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-post"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/thread"
          element={
            <PrivateRoute>
              <Thread />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat-link"
          element={
            <PrivateRoute>
              <ChatLink />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
      
      {/* Show navigation bar only when user is authenticated */}
      {userInfo && <NavBar />}
    </BrowserRouter>
  );
}

export default App;
