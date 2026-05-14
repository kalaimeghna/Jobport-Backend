import express from "express";

import {
  registerUser,
  loginUser,
  forgotPassword,
  changePassword,
 
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// Register
router.post(
  "/register",
  registerUser
);


// Login
router.post(
  "/login",
  loginUser
);


// Forgot Password
router.post(
  "/forgot-password",
  forgotPassword
);


// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);




export default router;