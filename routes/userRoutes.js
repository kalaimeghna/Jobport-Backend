import express from "express";

import {

  registerUser,

  loginUser,

  getUserProfile,

  updateUserProfile,

} from "../controllers/userController.js";

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
  getUserProfile
);


// ================= UPDATE PROFILE =================

router.put(
  "/profile",
  protect,
  updateUserProfile
);


export default router;