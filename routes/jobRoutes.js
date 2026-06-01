import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  getRecommendedJobs,
  getEmployerJobs,
} from "../controllers/jobController.js";

import { protect, employerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= RECOMMENDED JOBS =================
router.get("/recommended", getRecommendedJobs);

// ================= EMPLOYER DASHBOARD JOBS =================
// (Jobs created by logged-in employer + applicant count)
router.get("/employer", protect, employerOnly, getEmployerJobs);

// ================= EMPLOYER OWN JOBS =================
// (Simple list of jobs by employer)
router.get("/my", protect, employerOnly, getMyJobs);

// ================= CREATE JOB =================
router.post("/", protect, employerOnly, createJob);

// ================= GET ALL JOBS =================
router.get("/", getJobs);

// ================= SINGLE JOB =================
router.get("/:id", getJobById);

// ================= UPDATE JOB =================
router.put("/:id", protect, employerOnly, updateJob);

// ================= DELETE JOB =================
router.delete("/:id", protect, employerOnly, deleteJob);

export default router;