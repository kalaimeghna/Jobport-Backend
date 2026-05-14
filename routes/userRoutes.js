import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();


//Register
router.post("/register", registerUser);


//Login 
router.post("/login", loginUser);


//Profile
router.get("/profile", protect, getUserProfile);

//update profile
router.put("/profile", protect, updateUserProfile);



export default router;