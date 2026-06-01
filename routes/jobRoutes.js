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

// PUBLIC
router.get("/", getJobs);
router.get("/:id", getJobById);

// PROTECTED
router.get("/my", protect, employerOnly, getMyJobs);
router.post("/", protect, employerOnly, createJob);
router.put("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);

// RECOMMENDED (jobseeker)
router.get("/recommended", protect, getRecommendedJobs);

export default router;