import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import crypto from "crypto";

import sendEmail
from "../utils/sendEmail.js";


// ================= GENERATE TOKEN =================

const generateToken =
  (id) => {

    return jwt.sign(
      { id },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
  };


// ================= REGISTER USER =================

export const registerUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
        role,
        phone,
        skills,
        experience,
      } = req.body;


      // VALIDATION

      if (
        !name ||
        !email ||
        !password ||
        !role
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please fill all fields",

        });
      }


      // CHECK USER EXISTS

      const userExists =
        await User.findOne({
          email,
        });

      if (userExists) {

        return res.status(400).json({

          success: false,

          message:
            "User already exists",

        });
      }


      // HASH PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      // CREATE USER

      const user =
        await User.create({

          name,

          email,

          password:
            hashedPassword,

          role,

          phone,

          skills,

          experience,

        });


      // RESPONSE

      res.status(201).json({

        success: true,

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        phone: user.phone,

        skills: user.skills,

        experience:
          user.experience,

        token:
          generateToken(
            user._id
          ),

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= LOGIN USER =================

export const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;


      // VALIDATION

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please provide email and password",

        });
      }


      // FIND USER

      const user =
        await User.findOne({
          email,
        });


      // CHECK PASSWORD

      if (
        user &&
        (
          await bcrypt.compare(
            password,
            user.password
          )
        )
      ) {

        res.status(200).json({

          success: true,

          _id: user._id,

          name: user.name,

          email: user.email,

          role: user.role,

          phone: user.phone,

          skills: user.skills,

          experience:
            user.experience,

          token:
            generateToken(
              user._id
            ),

        });

      } else {

        res.status(401).json({

          success: false,

          message:
            "Invalid email or password",

        });
      }

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= GET PROFILE =================

export const getProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).select("-password");


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });
      }


      res.status(200).json({

        success: true,

        user,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= UPDATE PROFILE =================

export const updateProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });
      }


      // UPDATE FIELDS

      user.name =
        req.body.name ||
        user.name;

      user.email =
        req.body.email ||
        user.email;

      user.phone =
        req.body.phone ||
        user.phone;

      user.skills =
        req.body.skills ||
        user.skills;

      user.experience =
        req.body.experience ||
        user.experience;


      // SAVE USER

      await user.save();


      // GET UPDATED USER WITHOUT PASSWORD

      const updatedUser =
        await User.findById(
          user._id
        ).select("-password");


      // RESPONSE

      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        user: updatedUser,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= FORGOT PASSWORD =================

export const forgotPassword =
  async (req, res) => {

    try {

      const user =
        await User.findOne({

          email:
            req.body.email,

        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });
      }

      // GENERATE TOKEN

      const resetToken =
        crypto.randomBytes(20)
          .toString("hex");

      // HASH TOKEN

      user.resetPasswordToken =
        crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");

      // EXPIRE TIME

      user.resetPasswordExpire =
        Date.now() +
        10 * 60 * 1000;

      await user.save();

      // RESET URL

      const resetUrl =
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        console.log(resetUrl);

      const message =
        `Reset your password using this link: ${resetUrl}`;

      // SEND EMAIL

      await sendEmail(

        user.email,

        "Password Reset",

        message

      );

      res.status(200).json({

        success: true,

        message:
          "Reset email sent",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= RESET PASSWORD =================

export const resetPassword =
  async (req, res) => {

    try {

      // HASH TOKEN

      const resetPasswordToken =
        crypto
          .createHash("sha256")
          .update(req.params.token)
          .digest("hex");

      // FIND USER

      const user =
        await User.findOne({

          resetPasswordToken,

          resetPasswordExpire: {
            $gt: Date.now(),
          },

        });

      if (!user) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid or expired token",

        });
      }

      // HASH NEW PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          req.body.password,
          10
        );

      user.password =
        hashedPassword;

      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpire =
        undefined;

      await user.save();

      res.status(200).json({

        success: true,

        message:
          "Password reset successful",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

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
          req.user._id
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });
      }

      // CHECK OLD PASSWORD

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

      // HASH NEW PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.status(200).json({

        success: true,

        message:
          "Password changed successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };