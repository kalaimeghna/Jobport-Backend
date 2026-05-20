import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";


// ================= GENERATE TOKEN =================

const generateToken = (id) => {

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


      // CHECK EXISTING USER
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


      // CHECK USER
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

export const getUserProfile =
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

export const updateUserProfile =
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

      const updatedUser =
        await user.save();


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