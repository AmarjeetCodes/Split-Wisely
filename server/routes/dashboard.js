// server/routes/dashboard.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // import our auth middleware

router.get("/dashboard", auth, (req, res) => {
  res.json({ message: `Hello user ${req.user.userId}, welcome to your dashboard.` });
});

module.exports = router;
