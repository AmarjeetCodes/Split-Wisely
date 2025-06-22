import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import splitwiseImage from "../assets/first.jpg";

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful!");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    // <div className="fixed top-0 left-0 min-h-screen w-screen bg-neutral-800 flex items-center justify-center">
      <div className="fixed top-0 left-0 min-h-screen w-screen bg-neutral-800 flex items-start justify-center pt-4 md:items-center md:pt-0">


      {/* Phone Wrapper */}
      <div className="rounded-2xl bg-blue-600 w-[370px] h-[720px] p-6 shadow-xl flex flex-col items-center text-white">
        {/* Top */}
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">💸Split WiseLy </h1>
             <img
                src={splitwiseImage}
                alt="Split wisely illustration"
                className="w-64 h-auto mb-6 object-contain"
              />
          {/* <div className="w-64 h-40 bg-blue-500 rounded-xl mb-6" /> */}
          <p className="text-2xl text-center  ">
            Lets split your bills - wisely
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 ">
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
            className="px-3 py-2 rounded-md text-black placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-white text-blue-600 py-2 rounded-md font-semibold"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="border border-white py-2 rounded-md font-semibold"
          >
            Sign up
          </button>
          {message && <p className="text-sm text-center">{message}</p>}
        </form>

        {/* Footer */}
        {/* <div className="text-xs text-center mt-8 px-2">
          <p>
            By signing up, you agree to our{" "}
            <span className="underline">Terms of service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
          <p className="mt-2 underline">Contact support</p>
        </div> */}
      </div>
    </div>
  );
}

export default Login;
