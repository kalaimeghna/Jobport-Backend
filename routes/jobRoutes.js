import express from "express";

import {
  createJob,
  getJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getRecommendedJobs,
} from "../controllers/jobController.js";

import { protect }
from "../middleware/authMiddleware.js";

import employerOnly
from "../middleware/roleMiddleware.js";

const router = express.Router();


// CREATE JOB
router.post(
  "/",
  protect,
  employerOnly,
  createJob
);


// GET ALL JOBS
router.get("/", getJobs);


// JOB RECOMMENDATIONS
router.get(
  "/recommendations",
  protect,
  getRecommendedJobs
);


// GET SINGLE JOB
router.get("/:id", getSingleJob);


// UPDATE JOB
router.put(
  "/:id",
  protect,
  employerOnly,
  updateJob
);


// DELETE JOB
router.delete(
  "/:id",
  protect,
  employerOnly,
  deleteJob
);

export default router;