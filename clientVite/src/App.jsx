import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import CreateGroupModal from "./components/CreateGroupModal";
import GroupPage from "./pages/GroupPage";
import Inbox from "./pages/inbox";
import Activity from "./pages/activity";

import Profile from "./pages/profile";


function App() {
  const [count, setCount] = useState(0);

  console.log("llfdask")
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox/>} />
          <Route path="/activity" element={<Activity/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/group/:groupId" element={<CreateGroupModal />} />
          <Route path="/groupPage/:groupId" element={<GroupPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
