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

// ================= PUBLIC ROUTES =================
router.get("/", getJobs);
router.get("/:id", getJobById);

// ================= PROTECTED ROUTES =================
router.get("/recommended", protect, getRecommendedJobs);

router.get("/my-jobs", protect, employerOnly, getMyJobs);

router.post("/", protect, employerOnly, createJob);
router.put("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);

export default router;