import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// ================= GENERATE TOKEN =================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      skills,
      experience,
      education,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const allowedRoles = ["jobseeker", "employer"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || "",
      skills: skills
        ? Array.isArray(skills)
          ? skills
          : skills.split(",").map((s) => s.trim())
        : [],
      experience: experience || "",
      education: education || "",
      profilePic: "",
    });

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: safeUser,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN USER =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({
        email: req.body.email,
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }

      user.email = req.body.email;
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    if (req.body.skills) {
      user.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(",").map((s) => s.trim());
    }

    user.experience = req.body.experience || user.experience;
    user.education = req.body.education || user.education;
    user.profilePic = req.body.profilePic || user.profilePic;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `Reset your password using the link below:\n\n${resetUrl}`
    );

    return res.status(200).json({
      success: true,
      message: "Reset email sent successfully",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};