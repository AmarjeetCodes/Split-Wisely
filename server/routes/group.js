// server/routes/group.js

const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

//Leave a group
router.post("/group/:groupId/leave", auth, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.userId;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Remove the user from the group
    group.members = group.members.filter(id => id.toString() !== userId);
    await group.save();

    res.json({ message: "You left the group." });
  } catch (err) {
    console.error("Leave group error:", err);
    res.status(500).json({ message: "Server error while leaving group" });
  }
});


//  GET all groups user is part of
router.get("/groups", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const groups = await Group.find({ members: userId });
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET a single group with member names & phones
router.get("/group/:groupId", auth, async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate("members", "name phone");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET all expenses in a group
router.get("/group/:groupId/expenses", auth, async (req, res) => {
  const { groupId } = req.params;

  try {
    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name")
      .populate("participants", "name");

    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
});

//  GET summary for logged-in user in the group
router.get("/group/:groupId/summary", auth, async (req, res) => {
  const { groupId } = req.params;
  const loggedInUserId = req.user.userId;

  try {
    const group = await Group.findById(groupId).populate("members", "name");
    const expenses = await Expense.find({ group: groupId });

    const net = {};
    group.members.forEach(member => {
      net[member._id] = 0;
    });

    for (const exp of expenses) {
      const involved = exp.participants && exp.participants.length > 0
        ? exp.participants
        : group.members.map(m => m._id);

      const share = exp.amount / involved.length;

      involved.forEach(memberId => {
        if (memberId.toString() === exp.paidBy.toString()) {
          net[memberId] += exp.amount - share;
        } else {
          net[memberId] -= share;
        }
      });
    }

    const balances = {};
    for (const [memberId, balance] of Object.entries(net)) {
      if (memberId === loggedInUserId) continue;

      const diff = net[memberId] - net[loggedInUserId];
      const memberName = group.members.find(m => m._id.toString() === memberId)?.name || "Unknown";
      balances[memberName] = -diff;
    }

    res.json({ balances });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to calculate balances" });
  }
});

//  Create a group
router.post("/group/create", auth, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const newGroup = new Group({
      name,
      members: [userId],
    });

    await newGroup.save();
    res.status(201).json({ message: "Group created", group: newGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  Add member to group by phone
router.post("/group/:groupId/add-member", auth, async (req, res) => {

  console.log(" /add-member hit with group:", req.params.groupId, "and phone:", req.body.phone);

  const { phone } = req.body;
  const { groupId } = req.params;

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(user._id)) {
      return res.status(409).json({ message: "User already in group" });
    }

    group.members.push(user._id);
    await group.save();

    res.status(200).json({ message: "User added to group", group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  Add expense with selected participants
router.post("/group/:groupId/expense", auth, async (req, res) => {
  const { groupId } = req.params;
  const { amount, description, participants } = req.body;
  const paidBy = req.user.userId;

  if (!amount || isNaN(amount) || !participants || participants.length === 0) {
    return res.status(400).json({ message: "Invalid amount or participants missing" });
  }

  try {
    const expense = new Expense({
      group: groupId,
      paidBy,
      amount,
      description,
      participants,
    });

    await expense.save();
    res.status(201).json({ message: "Expense recorded", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//  Delete an expense
router.delete("/group/:groupId/expense/:expenseId", auth, async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.expenseId);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Update an expense
router.put("/group/:groupId/expense/:expenseId", auth, async (req, res) => {
  const { description, amount } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.expenseId,
      { description, amount },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense updated successfully", expense: updatedExpense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
