import React, { useState, useEffect } from "react";
import axios from "axios";

const AddExpenseModal = ({ groupId, onClose, onExpenseAdded }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // ✅ Fetch group members when modal is opened
  useEffect(() => {
    if (!groupId) return;

    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/group/${groupId}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setMembers(res.data.members || []);
      } catch (err) {
        console.error("Error fetching members:", err);
        alert("Failed to load group members.");
      }
    };

    fetchMembers();
  }, [groupId]);

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAddExpense = async () => {
    if (!amount || !description || selectedMembers.length === 0) {
      alert("Please fill all fields and select at least one member.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/group/${groupId}/expense`,
        {
          amount: parseFloat(amount),
          description,
          participants: selectedMembers,
        },
        {
          headers: { Authorization: token },
        }
      );

      console.log("Expense added:", res.data);
      onExpenseAdded(); // Refresh expenses in parent
      onClose(); // Close modal
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Error adding expense. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">
        <h2 className="text-lg font-bold mb-4">Add Expense</h2>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
        />

        <div className="mb-3 max-h-32 overflow-y-auto">
          <p className="font-semibold mb-1">Split with:</p>
          {members.length > 0 ? (
            members.map((member) => (
              <label key={member._id} className="block text-sm">
                <input
                  type="checkbox"
                  value={member._id}
                  checked={selectedMembers.includes(member._id)}
                  onChange={() => toggleMember(member._id)}
                  className="mr-2"
                />
                {member.name}
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No members found.</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExpense}
            className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
