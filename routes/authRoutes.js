import express from "express";

import {

  registerUser,

  loginUser,

  getProfile,

  updateProfile,

  forgotPassword,

  resetPassword,

  changePassword,

} from "../controllers/authController.js";

import {

  protect,

} from "../middleware/authMiddleware.js";

const router =
  express.Router();


// ================= REGISTER =================

router.post(
  "/register",
  registerUser
);


// ================= LOGIN =================

router.post(
  "/login",
  loginUser
);


// ================= GET PROFILE =================

router.get(
  "/profile",
  protect,
  getProfile
);


// ================= UPDATE PROFILE =================

router.put(
  "/profile",
  protect,
  updateProfile
);


// ================= FORGOT PASSWORD =================

router.post(
  "/forgot-password",
  forgotPassword
);



// ================= RESET PASSWORD =================

router.put(
  "/reset-password/:token",
  resetPassword
);

// ================= CHANGE PASSWORD =================

router.put(
  "/change-password",
  protect,
  changePassword
);


export default router;