// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiHome, FiBell } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { BsInboxFill } from "react-icons/bs";
import CreateGroupModal from "../components/CreateGroupModal";
import catImage from "../assets/dashboard.jpg";



const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const fullUrl = `${import.meta.env.VITE_API_BASE}/api/groups`;
console.log("Requesting groups from:", fullUrl);
const res = await axios.get(fullUrl, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
    try {
     const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/groups`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });
          console.log("🔍 groups response:", res.data);
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };


  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed top-0 left-0 min-h-screen w-screen bg-neutral-800 flex items-center justify-center">
     <div className="rounded-2xl bg-white w-[370px] h-[715px] shadow-xl flex flex-col justify-between overflow-hidden">


        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Groups</h1>
          {showSearch ? (
            <input
              type="text"
              placeholder="Search groups"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-2 py-1 rounded-md w-40 text-sm"
            />
          ) : (
            <FiSearch
              size={22}
              className="cursor-pointer text-gray-600"
              onClick={() => setShowSearch(true)}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center mt-10 text-center">
              <img src={catImage} alt="No groups" className="w-60 h-50 mb-4" />
              <p className="font-semibold text-lg text-gray-800">No groups</p>
              <p className="text-sm text-gray-500">Create your first group now!</p>
            </div>
          ) : (
            <div className="space-y-4">
            {filteredGroups.map((group) => (
              <Link
                key={group._id} // ✅ Add this line!
                to={`/groupPage/${group._id}`}
                className="block p-4 bg-blue-100 rounded-lg shadow hover:bg-blue-200"
              >
                <h2 className="font-semibold text-gray-800">{group.name}</h2>
              </Link>
            ))}
            </div>
          )}
        </div>

        {/* Create Group Button */}
      <div className="px-4 pb-3 flex justify-end">
            <button
                onClick={() => setShowModal(true)}
                className="bg-purple-600 text-white px-5 py-2 mb-7 rounded-3xl shadow hover:bg-purple-700"
            >
                + Create Group
            </button>
            </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around items-center h-14 border-t bg-white">
          <Link to="/dashboard">
            <FiHome className="text-blue-500" size={22} />
          </Link>
          <Link to="/inbox">
            <BsInboxFill className="text-gray-700" size={20} />
          </Link>
          <Link to="/activity">
            <FiBell className="text-gray-700" size={22} />
          </Link>
          <Link to="/profile">
            <FaUserAlt className="text-gray-700" size={20} />
          </Link>
        </div>

        {/* Modal */}
        <CreateGroupModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onGroupCreated={(newGroup) => setGroups((prev) => [...prev, newGroup])}
        />
      </div>
    </div>
  );
};

export default Dashboard;
