import './App.css';
import Welcome from './screens/Auth/Welcome/Welcome';
import Login from "./screens/Auth/Login/Login";
import Register from "./screens/Auth/Register/Register";
import Discussion from "./screens/DiscussionBoard/Discussion/Discussion";
import CreatePost from "./screens/DiscussionBoard/CreatePost/CreatePost";
import Home from "./screens/Home/Home";
import Admin from "./screens/Admin/Admin";
import Calendar from "./screens/Calendar/Calendar";
import ChatLink from "./screens/ChatLink/ChatLink";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./components/NavBar/NavBar";
import PrivateRoute from './screens/Auth/PrivateRoute';


function App() {

  const userLogin = useSelector((state) => state.userLogin);
  // Destructures the relevant information
  const { userInfo } = userLogin;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/discussion" element={<PrivateRoute><Discussion /></PrivateRoute>} />
        <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="/chat-link" element={<PrivateRoute><ChatLink /></PrivateRoute>} />
      </Routes>
      {userInfo && <NavBar />}
    </BrowserRouter>
  );
}

export default App;
