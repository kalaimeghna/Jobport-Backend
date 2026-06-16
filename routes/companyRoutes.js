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
router.post(
  "/",
  protect,
  employerOnly,
  createCompany
);

// ================= GET ALL COMPANIES =================
router.get(
  "/",
  getCompanies
);

// ================= GET MY COMPANIES =================
router.get(
  "/my",
  protect,
  employerOnly,
  getMyCompanies
);

// ================= GET SINGLE COMPANY =================
router.get(
  "/:id",
  validateObjectId,
  getCompanyById
);

// ================= UPDATE COMPANY =================
router.put(
  "/:id",
  protect,
  employerOnly,
  validateObjectId,
  updateCompany
);

// ================= DELETE COMPANY =================
router.delete(
  "/:id",
  protect,
  employerOnly,
  validateObjectId,
  deleteCompany
);

export default router;