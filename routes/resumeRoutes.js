import express from "express";

import {
  uploadResume,
  getResume,
  deleteResume,
} from "../controllers/resumeController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import upload
from "../middleware/uploadMiddleware.js";

const router =
  express.Router();


// ================= UPLOAD RESUME =================

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);


// ================= GET MY RESUMES =================

router.get(
  "/my",
  protect,
  getResume
);


// ================= DELETE RESUME =================

router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;