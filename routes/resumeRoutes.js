import express from "express";
import upload  from "../middleware/uploadMiddleware.js";

import {
  uploadResume,
  getMyResumes,
  deleteResume,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= UPLOAD RESUME =================
router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadResume
);


// ================= GET MY RESUMES =================
router.get("/my", protect, getMyResumes);


// ================= DELETE RESUME =================
router.delete("/:id", protect, deleteResume);


export default router;