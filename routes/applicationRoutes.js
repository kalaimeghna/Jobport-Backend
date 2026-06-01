import express from "express";

import {
  applyJob,
  getMyApplications,
  getEmployerApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/cloudinaryUpload.js";

const router = express.Router();

// ================= APPLY JOB =================
router.post(
  "/apply/:jobId",
  protect,
  upload.single("resume"),
  applyJob
);

// ================= MY APPLICATIONS =================
router.get(
  "/me",
  protect,
  getMyApplications
);

// ================= EMPLOYER APPLICATIONS =================
router.get(
  "/employer",
  protect,
  getEmployerApplications
);

// ================= JOB WISE APPLICATIONS =================
router.get(
  "/job/:jobId",
  protect,
  getJobApplications
);

// ================= UPDATE STATUS (ATS) =================
router.put(
  "/status/:applicationId",
  protect,
  updateApplicationStatus
);

export default router;