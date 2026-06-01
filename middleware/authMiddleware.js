import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * ================= PROTECT ROUTE =================
 * Verifies JWT token and attaches user to req.user
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // ❌ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // ================= GET USER ID =================
    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    // ================= FIND USER =================
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= ATTACH USER =================
    // IMPORTANT: normalize id so you can safely use req.user.id everywhere
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
    });
  }
};

/**
 * ================= EMPLOYER ONLY =================
 */
export const employerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "employer") {
    return res.status(403).json({
      success: false,
      message: "Employer access only",
    });
  }

  next();
};

/**
 * ================= JOBSEEKER ONLY =================
 */
export const jobseekerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "jobseeker") {
    return res.status(403).json({
      success: false,
      message: "Jobseeker access only",
    });
  }

  next();
};

/**
 * ================= ADMIN ONLY =================
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};