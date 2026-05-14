import express from "express";
import {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
} from "../controllers/companyController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

//Create Company 
router.post("/", protect, createCompany);
//Get All Comapanies
router.get("/", getCompanies);
//Get Single Company
router.get("/:id", getCompanyById);
//Update Company

router.put("/:id", protect, updateCompany);
//Delete Company
router.delete("/:id", protect, deleteCompany);

export default router;