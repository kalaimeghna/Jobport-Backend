import express from "express";

import {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ================= APPLY JOB (WITH RESUME UPLOAD) =================
router.post(
  "/apply/:jobId",
  protect,
  upload.single("resume"), // MUST match frontend formData key
  applyJob
);

// ================= JOB SEEKER: MY APPLICATIONS =================
router.get("/my", protect, getMyApplications);

// ================= EMPLOYER: JOB WISE APPLICATIONS =================
router.get("/job/:jobId", protect, getJobApplications);

// ================= UPDATE STATUS (ATS FLOW) =================
router.put("/status/:applicationId", protect, updateApplicationStatus);

export default router;