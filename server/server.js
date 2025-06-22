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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
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
