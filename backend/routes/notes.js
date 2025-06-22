const express = require("express");
const Note = require("../models/Note");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../middleware/error");

// ✅ Get all notes for a candidate
router.get(
  "/:candidateId",
  asyncHandler(async (req, res, next) => {
    const notes = await Note.find({ candidateId: req.params.candidateId }).sort(
      {
        createdAt: 1,
      }
    );

    if (!notes || notes.length === 0) {
      return next(new ErrorHandler("No notes found for this candidate", 404));
    }

    res.json(notes);
  })
);

// ✅ Get notifications for a user (tagged in notes)
router.get(
  "/notifications/:userId",
  asyncHandler(async (req, res, next) => {
    const notes = await Note.find({ taggedUsers: req.params.userId }).sort({
      createdAt: -1,
    });

    if (!notes || notes.length === 0) {
      return next(
        new ErrorHandler("No notifications found for this user", 404)
      );
    }

    res.json(
      notes.map((n) => ({
        candidateId: n.candidateId,
        message: n.message,
        userName: n.userName,
        noteId: n._id,
        createdAt: n.createdAt,
      }))
    );
  })
);

module.exports = router;
