import express from "express";

import {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// APPLY JOB
router.post(
  "/:jobId",
  protect,
  applyJob
);


// GET MY APPLICATIONS
router.get(
  "/my-applications",
  protect,
  getMyApplications
);


// GET APPLICATIONS FOR ONE JOB
router.get(
  "/job/:jobId",
  protect,
  getJobApplications
);


// UPDATE APPLICATION STATUS
router.put(
  "/:id/status",
  protect,
  updateApplicationStatus
);

export default router;