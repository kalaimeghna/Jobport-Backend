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

export default router;