const express = require("express");
const Note = require("../models/Note");
const router = express.Router();

// Get all notes for a candidate
router.get("/:candidateId", async (req, res) => {
  const notes = await Note.find({ candidateId: req.params.candidateId }).sort({
    createdAt: 1,
  });
  res.json(notes);
});

// Get notifications for a user
router.get("/notifications/:userId", async (req, res) => {
  const notes = await Note.find({ taggedUsers: req.params.userId }).sort({
    createdAt: -1,
  });
  res.json(
    notes.map((n) => ({
      candidateId: n.candidateId,
      message: n.message,
      userName: n.userName,
      noteId: n._id,
      createdAt: n.createdAt,
    }))
  );
});

module.exports = router;
