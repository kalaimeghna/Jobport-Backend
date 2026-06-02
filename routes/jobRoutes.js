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

// ================= PUBLIC =================
router.get("/", getJobs);

// ================= STATIC ROUTES (IMPORTANT) =================
router.get("/my", protect, employerOnly, getMyJobs);
router.get("/recommended", protect, getRecommendedJobs);

// ================= CRUD =================
router.post("/", protect, employerOnly, createJob);
router.put("/:id", protect, employerOnly, updateJob);
router.delete("/:id", protect, employerOnly, deleteJob);

// ================= DYNAMIC ROUTE (MUST BE LAST) =================
router.get("/:id", getJobById);

export default router;