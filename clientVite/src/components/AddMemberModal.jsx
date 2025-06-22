import React, { useState } from "react";
import axios from "axios";

const AddMemberModal = ({ groupId, onClose, onMemberAdded }) => {
  const [phone, setPhone] = useState("");

  const handleAddMember = async () => {
    if (!phone) {
      alert("Please enter a phone number.");
      return;
    }

    console.log("Sending phone:", typeof phone, phone);


    try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE}/api/group/${groupId}/add-member`,
          { phone },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
      console.log("User added to group:", res.data);
      onMemberAdded(); // refresh members in parent
      onClose();       // close modal
    } catch (err) {
  console.error("Error adding member:", err.response?.data || err.message || err);
  alert(err.response?.data?.message || "Failed to add member.");
}

  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">
        <h2 className="text-lg font-bold mb-4">Add Member</h2>

        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMember}
            className="px-4 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
