import express from "express";

import {
  uploadResume,
  getResume,
  deleteResume,
} from "../controllers/resumeController.js";

import {
  protect,
  jobseekerOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= UPLOAD RESUME =================
router.post(
  "/upload",
  protect,
  jobseekerOnly,
  upload.single("resume"),
  uploadResume
);

// ================= GET MY RESUMES =================
router.get(
  "/my",
  protect,
  jobseekerOnly,
  getResume
);

// ================= DELETE RESUME =================
router.delete(
  "/:id",
  protect,
  jobseekerOnly,
  deleteResume
);

export default router;