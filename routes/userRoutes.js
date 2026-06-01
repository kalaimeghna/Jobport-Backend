import express from "express";

import {
  getUserProfile,
  updateUserProfile,
  getUserById,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= GET CURRENT USER PROFILE =================
router.get("/profile", protect, getUserProfile);

// ================= UPDATE PROFILE (WITH IMAGE UPLOAD) =================
router.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateUserProfile
);

// ================= GET USER BY ID =================
router.get("/:id", getUserById);

export default router;