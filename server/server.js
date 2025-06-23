require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// import cors from "cors";

// Route imports
const authRoutes = require("./routes/auth");
const dashboardRoute = require("./routes/dashboard");
const groupRoutes = require("./routes/group");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://split-wisely-frontend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://split-wisely-frontend.onrender.com"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());

// Mount all routes correctly
app.use("/api/auth", authRoutes);         // All auth routes now under /api/auth/*
app.use("/api/dashboard", dashboardRoute);
app.use("/api", groupRoutes);             // Group routes like /api/groups, /api/group/create

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
