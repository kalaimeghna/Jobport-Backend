import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";



// ================= REGISTER =================

export const registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Check user exists
    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= LOGIN =================

export const loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    // Check user
    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= FORGOT PASSWORD =================

export const forgotPassword =
  async (req, res) => {
    try {
      const { email } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Create reset token
      const resetToken =
        crypto
          .randomBytes(20)
          .toString("hex");

      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpire =
        Date.now() + 10 * 60 * 1000;

      await user.save();

      // Reset URL
      const resetUrl =
        `http://localhost:5173/reset-password/${resetToken}`;

      // Send email
      await sendEmail(
        user.email,
        "Password Reset",
        `Reset your password using this link: ${resetUrl}`
      );

      res.status(200).json({
        success: true,
        message:
          "Reset email sent",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



// ================= CHANGE PASSWORD =================

export const changePassword =
  async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      // Check old password
      const isMatch =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Old password incorrect",
        });
      }

      // Hash new password
      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(
          newPassword,
          salt
        );

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password changed",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };