import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= RATE LIMITER =================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

// ================= REGISTER =================
router.post("/register", authLimiter, registerUser);

// ================= LOGIN =================
router.post("/login", authLimiter, loginUser);

// ================= PROFILE =================
router.get("/profile", protect, getProfile);
router.put("/profile",protect,upload.single("profilePicture"),updateProfile);

// ================= PASSWORD MANAGEMENT =================
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", protect, changePassword);

export default router;