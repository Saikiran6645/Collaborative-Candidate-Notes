const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../middleware/error");

// ✅ Get all notifications for the logged-in user
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res, next) => {
    const notifications = await Notification.find({
      recipientId: req.user.id,
    }).sort({ createdAt: -1 });

    if (!notifications || notifications.length === 0) {
      return next(new ErrorHandler("No notifications found", 404));
    }

    res.json(notifications);
  })
);

// ✅ Delete a notification by ID
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res, next) => {
    const deleted = await Notification.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new ErrorHandler("Notification not found", 404));
    }

    res.json({ message: "Notification deleted successfully" });
  })
);

module.exports = router;
