import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import AddExpenseModal from "../components/AddExpenseModal";
import AddMemberModal from "../components/AddMemberModal";
import axios from "axios";

const GroupPage = () => {
  const { groupId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [group, setGroup] = useState(null);
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [balances, setBalances] = useState({});

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.userId);
    } catch (err) {
      console.error("Invalid token", err);
    }

    fetchGroupDetails();
    fetchExpenses();
    fetchSummary();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/group/${groupId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setGroup(res.data);
    } catch (err) {
      console.error("Failed to fetch group:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/group/${groupId}/expenses`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setExpenses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setExpenses([]);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/group/${groupId}/summary`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setBalances(res.data.balances || {});
    } catch (err) {
      console.error("Failed to fetch summary", err);
      setBalances({});
    }
  };

  const handleLeaveGroup = async () => {
  if (!window.confirm("Are you sure you want to leave this group?")) return;

  try {
    await axios.post(
      `${API_BASE}/api/group/${groupId}/leave`,
      {},
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    alert("You have left the group.");
    window.location.href = "/dashboard"; // or use `useNavigate()` from react-router
  } catch (err) {
    console.error("Failed to leave group", err);
    alert("Error leaving group. Please try again.");
  }
};


  return (
    <div className="fixed top-0 left-0 min-h-screen w-screen bg-neutral-800 flex items-center justify-center">
      <div className="rounded-2xl bg-white w-[370px] h-[715px] shadow-xl flex flex-col overflow-hidden relative">

        {/* Group Name Fixed Top */}
        <div
          className="bg-white w-full border-b p-4 text-center font-bold text-xl text-gray-800 cursor-pointer hover:text-blue-600"
          onClick={() => setShowMembers((prev) => !prev)}
        >
          {group?.name}
        </div>

        {/* Member List Dropdown */}
        {showMembers && (
          <div className="bg-gray-100 mx-4 mt-2 p-3 rounded-lg shadow z-10">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Group Members:
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {group?.members?.map((member) => (
                <li key={member._id}>
                  {member.name} {member._id === userId ? "(You)" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 flex gap-3">
          <FiUserPlus
            className="text-gray-700 cursor-pointer"
            size={22}
            title="Add Member"
            onClick={() => setShowAddMemberModal(true)}
          />
          <FaMoneyBillWave
            className="text-green-600 cursor-pointer"
            size={20}
            title="View Summary"
            onClick={() => setShowSummary((prev) => !prev)}
          />
        </div>

        {/* 💸 Summary Modal */}
        {showSummary && (
          <div className="absolute top-16 right-4 bg-white p-4 shadow-xl rounded-xl w-[280px] z-50">
            <h3 className="font-semibold text-gray-700 mb-2">Your Balances:</h3>
            {Object.keys(balances).length === 0 ? (
              <p className="text-sm text-gray-500">No balances to show.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {Object.entries(balances).map(([name, amount]) => (
                  <li key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span
                      className={`font-semibold ${
                        amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{Math.abs(amount).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowSummary(false)}
              className="mt-3 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
            >
              Close
            </button>
          </div>
        )}

        {/* Expenses as Chat Bubbles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 mt-2">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No expenses yet. Start by adding one below!
            </p>
          ) : (
            expenses.map((exp) => {
              const isMine = exp.paidBy._id === userId;
              return (
                <div
                  key={exp._id}
                  className={`max-w-[70%] px-4 py-2 rounded-xl shadow-md text-white ${
                    isMine
                      ? "ml-auto bg-blue-500 text-right"
                      : "mr-auto bg-gray-400 text-left"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {isMine ? "You" : exp.paidBy.name} paid ₹{exp.amount}
                  </p>
                  <p className="text-xs text-white/90">{exp.description}</p>
                </div>
              );
            })
          )}
        </div>

        <button
  onClick={handleLeaveGroup}
  className="text-red-600 underline text-sm ml-2 hover:text-red-800"
>
  Leave Group
</button>

        {/* Bottom Bar */}
        <div className="border-t p-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white rounded-xl py-2 font-semibold hover:bg-blue-700"
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <AddExpenseModal
          groupId={groupId}
          onClose={() => setShowModal(false)}
          onExpenseAdded={() => {
            fetchExpenses();
            fetchSummary();
          }}
        />
      )}

      {showAddMemberModal && (
        <AddMemberModal
          groupId={groupId}
          onClose={() => setShowAddMemberModal(false)}
          onMemberAdded={() => {
            fetchGroupDetails();
            fetchSummary();
          }}
        />
      )}
    </div>
  );
};

export default GroupPage;
