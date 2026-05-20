import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecommendedJobs,
} from "../controllers/jobController.js";

import {
  protect,
  employerOnly,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();


// ================= CREATE JOB =================

router.post(
  "/",
  protect,
  employerOnly,
  createJob
);


// ================= GET ALL JOBS =================

router.get(
  "/",
  getJobs
);


// ================= RECOMMENDED JOBS =================

router.get(
  "/recommended",
  protect,
  getRecommendedJobs
);


// ================= GET SINGLE JOB =================

router.get(
  "/:id",
  getJobById
);


// ================= UPDATE JOB =================

router.put(
  "/:id",
  protect,
  employerOnly,
  updateJob
);


// ================= DELETE JOB =================

router.delete(
  "/:id",
  protect,
  employerOnly,
  deleteJob
);

export default router;