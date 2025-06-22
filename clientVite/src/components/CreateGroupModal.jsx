// components/CreateGroupModal.jsx
import React, { useState } from "react";
import axios from "axios";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");

  const handleCreate = async () => {
    if (!groupName) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/group/create`,
        { name: groupName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onGroupCreated(res.data.group); // Update dashboard with new group
      onClose();
      setGroupName("");
    } catch (err) {
      console.error("Failed to create group", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
  <div className="bg-white p-5 rounded-xl w-80 shadow-lg">
    <h2 className="text-lg font-bold mb-3">Enter</h2>
    <input
      type="text"
      placeholder="Group name"
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      className="border px-3 py-2 w-full rounded-md mb-4"
    />
    <div className="flex justify-end">
      <button onClick={onClose} className="mr-3 text-gray-600 hover:underline">
        Cancel
      </button>
      <button
        onClick={handleCreate}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
      >
        Create
      </button>
    </div>
  </div>
</div>)
};

export default CreateGroupModal;
