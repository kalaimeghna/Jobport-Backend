import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  getRecommendedJobs,
} from "../controllers/jobController.js";

import { protect, employerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= JOB ROUTES =================
router.post("/", protect, employerOnly, createJob);

router.get("/", getJobs);

router.get("/my", protect, employerOnly, getMyJobs);

router.get("/recommended", getRecommendedJobs);

router.get("/:id", getJobById);

router.put("/:id", protect, employerOnly, updateJob);

router.delete("/:id", protect, employerOnly, deleteJob);

export default router;