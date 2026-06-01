import express from "express";

import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getMyCompanies,
} from "../controllers/companyController.js";

import { protect, employerOnly } from "../middleware/authMiddleware.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = express.Router();

// ================= CREATE COMPANY =================
router.post("/", protect, employerOnly, createCompany);

// ================= GET ALL COMPANIES =================
router.get("/", getCompanies);

// ================= MY COMPANIES =================
router.get("/my", protect, employerOnly, getMyCompanies);

// ================= SINGLE COMPANY =================
router.get("/:id", getCompanyById);

// ================= UPDATE COMPANY =================
router.put("/:id", protect, employerOnly, updateCompany);

// ================= DELETE COMPANY =================
router.delete("/:id", protect, employerOnly, deleteCompany);

router.get("/:id", validateObjectId, getCompanyById);

router.put("/:id", validateObjectId, updateCompany);

router.delete("/:id", validateObjectId, deleteCompany);

export default router;