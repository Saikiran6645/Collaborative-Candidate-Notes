const express = require("express");
const Candidate = require("../models/Candidate");
const router = express.Router();

// List all candidates
router.get("/", async (req, res) => {
  const candidates = await Candidate.find({});
  res.json(candidates);
});

// Add candidate
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const candidate = await Candidate.create({ name, email });
  res.json(candidate);
});

module.exports = router;
