const express = require("express");
const Candidate = require("../models/Candidate");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../middleware/error");

// ✅ List all candidates
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const candidates = await Candidate.find({});
    res.json(candidates);
  })
);

// ✅ Add a new candidate
router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return next(new ErrorHandler("Name and email are required", 400));
    }

    const candidate = await Candidate.create({ name, email });
    res.status(201).json(candidate);
  })
);

// ✅ Get candidate by ID
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return next(new ErrorHandler("Candidate not found", 404));
    }

    res.json(candidate);
  })
);

module.exports = router;
