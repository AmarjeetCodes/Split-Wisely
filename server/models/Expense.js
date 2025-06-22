// server/models/Expense.js

const mongoose = require("mongoose");

/**
 * Expense Schema
 * 
 * Represents a single expense made in a group.
 * - group: The group this expense belongs to.
 * - paidBy: The user who paid the expense.
 * - amount: Total amount of the expense.
 * - description: Optional description (e.g., "Lunch", "Cab fare").
 * - participants: Array of users with whom this expense is split.
 * - createdAt: Timestamp of when the expense was recorded.
 */

const expenseSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be greater than 0"],
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
