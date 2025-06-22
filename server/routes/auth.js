const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup", async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
});

// POST /login
router.post("/login", async (req, res) => {
    const { phone, password } = req.body;
  
    try {
      // 1. Check if user exists
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }
  
      // 2. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // 3. Sign a JWT
      const token = jwt.sign(
        { userId: user._id, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // 4. Send token
      res.status(200).json({ token, message: "Login successful!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  
module.exports = router;
