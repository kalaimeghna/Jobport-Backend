import express from "express";

import {
  uploadResume,
  getResume,
  deleteResume,
} from "../controllers/resumeController.js";

import { protect }
from "../middleware/authMiddleware.js";

import upload
from "../middleware/uploadMiddleware.js";

const router = express.Router();


// Upload Resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);


// Get My Resumes
router.get(
  "/",
  protect,
  getResume
);


// Delete Resume
router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;