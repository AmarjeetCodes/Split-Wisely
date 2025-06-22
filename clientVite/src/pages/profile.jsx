import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiHome, FiBell, FiLogOut } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { BsInboxFill } from "react-icons/bs";
import catImage from "../assets/dashboard.jpg";

const Profile = () => {
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed top-0 left-0 min-h-screen w-screen bg-neutral-800 flex items-center justify-center">
      <div className="rounded-2xl bg-white w-[370px] h-[715px] shadow-xl flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Profile</h1>
          <div className="flex gap-4 items-center">
            <FiSearch size={22} className="cursor-pointer text-gray-600" />
            <FiLogOut
              size={22}
              className="cursor-pointer text-red-600 hover:text-red-700"
              title="Logout"
              onClick={handleLogout}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col items-center mt-10 text-center">
            <img src={catImage} alt="No groups" className="w-60 h-50 mb-4" />
            <p className="font-semibold text-lg text-gray-800">Log out</p>
            <p className="text-sm text-gray-500">up right corner!</p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around items-center h-14 border-t bg-white">
          <Link to="/dashboard">
            <FiHome className="text-gray-500" size={22} />
          </Link>
          <Link to="/inbox">
            <BsInboxFill className="text-gray-700" size={20} />
          </Link>
          <Link to="/activity">
            <FiBell className="text-gray-700" size={22} />
          </Link>
          <Link to="/profile">
            <FaUserAlt className="text-blue-700" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
