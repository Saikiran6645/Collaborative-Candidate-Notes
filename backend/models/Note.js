const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  candidateId: String,
  userId: String,
  userName: String,
  message: String,
  taggedUsers: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", noteSchema);
