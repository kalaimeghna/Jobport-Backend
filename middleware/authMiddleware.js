import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ================= PROTECT =================
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

// ================= EMPLOYER ONLY =================
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

// ================= JOBSEEKER ONLY =================
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