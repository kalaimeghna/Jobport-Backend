import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadResume,
  getMyResumes,
  deleteResume,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/my", protect, getMyResumes);

router.delete("/:id", protect, deleteResume);

export default router;