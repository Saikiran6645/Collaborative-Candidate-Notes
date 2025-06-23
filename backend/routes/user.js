const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const asyncHandler = require("express-async-handler");
const { ErrorHandler } = require("../middleware/error");
const auth = require("../middleware/auth");

const router = express.Router();

//  Register User
router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = await User.create({ name, email, password });

    generateToken(user, 201, "User registered successfully", res);
  })
);

//  Login User
router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    generateToken(user, 200, "User logged in successfully", res);
  })
);
router.get(
  "/logout",
  auth,
  asyncHandler(async (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // ✅ must match the original setting
      sameSite: "None", // ✅ must match original setting
    });
    res.json({ message: "User logged out successfully" });
  })
);

//  Get all users (for tagging/autocomplete)
router.get(
  "/all",
  asyncHandler(async (req, res, next) => {
    const users = await User.find({}, "_id name email");
    if (!users || users.length === 0) {
      return next(new ErrorHandler("No users found", 404));
    }
    res.json(users);
  })
);

module.exports = router;
