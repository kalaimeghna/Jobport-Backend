import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    // Check token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      // Get token
      token =
        req.headers.authorization.split(
          " "
        )[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Get user from DB
      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};