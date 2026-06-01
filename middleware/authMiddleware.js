import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

// ================= AUTH PROTECT =================
export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// ================= EMPLOYER ONLY =================
export const employerOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Employers only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role verification failed",
    });
  }
};