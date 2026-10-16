import express from "express";

import {
  requestOtp,
  verifyOtp,
  loginUser,
  getProfile,
} from "../controller/user.controller.js";

import { protect } from "../middleware/auth.middlerware.js";

import {
  loginLimiter,
  otpLimiter,
} from "../middleware/authRateLimit.js";

const userRouter = express.Router();

// Registration: send OTP
userRouter.post("/register", otpLimiter, requestOtp);

// Verify OTP: create account
userRouter.post(
  "/verify-register-otp",
  otpLimiter,
  verifyOtp
);

// Login
userRouter.post("/login", loginLimiter, loginUser);

// Profile
userRouter.get("/profile", protect, getProfile);

export default userRouter;