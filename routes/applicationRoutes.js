import express from "express";

import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getEmployerApplications,
} from "../controllers/applicationController.js";

import {
  protect,
  jobseekerOnly,
  employerOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= APPLY JOB =================
router.post(
  "/apply/:jobId",
  protect,
  jobseekerOnly,
  applyForJob
);

// ================= GET MY APPLICATIONS =================
router.get(
  "/my",
  protect,
  jobseekerOnly,
  getMyApplications
);

// ================= EMPLOYER ALL APPLICATIONS =================
router.get(
  "/employer",
  protect,
  employerOnly,
  getEmployerApplications
);

// ================= JOB APPLICANTS =================
router.get(
  "/job/:jobId",
  protect,
  employerOnly,
  getJobApplications
);

// ================= UPDATE STATUS =================
router.put(
  "/status/:id",
  protect,
  employerOnly,
  updateApplicationStatus
);

export default router;