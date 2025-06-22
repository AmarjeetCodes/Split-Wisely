import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import splitwiseImage from "../assets/first.jpg"; // same image as login

const API_BASE = import.meta.env.VITE_API_BASE;

function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! Redirecting to login...");
        navigate("/login");
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
     <div className="fixed top-0 left-0 min-h-screen w-screen bg-neutral-800 flex items-start justify-center pt-4 md:items-center md:pt-0">
      <div className="rounded-2xl bg-blue-600 w-[370px] h-[720px] p-6 shadow-xl flex flex-col items-center text-white">
        {/* Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Split WiseLy</h1>
          <br />
          <h1 className="text-6xl font-bold mb-4">💸</h1> <br /><br />
          <p className="text-2xl text-center ">
            Create your account <br /> start splitting bills
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 w-full">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2 rounded text-black placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="px-3 py-2 rounded text-black placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-3 py-2 rounded text-black placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-white text-blue-600 py-2 rounded-md font-semibold"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="border border-white py-2 rounded-md font-semibold"
          >
            Log in
          </button>
          {message && <p className="text-sm text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Signup;
