import express from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { imageUpload } from "../middleware/imageUpload.js";

const router = express.Router();

// ================= REGISTER =================
router.post("/register", registerUser);

// ================= LOGIN =================
router.post("/login", loginUser);

// ================= GET PROFILE =================
router.get("/profile", protect, getUserProfile);

// ================= UPDATE PROFILE =================
router.put(
  "/profile",
  protect,
  imageUpload.single("profilePicture"),
  updateUserProfile
);

export default router;