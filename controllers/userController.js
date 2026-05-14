import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//Generate JWT
const generateToken = (id) => {
    return jwt.sign(
        { id }, process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
};
//Register User 
export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
        } = req.body;
        if (!name || !email || !password || !role) {
    return res.status(400).json({
        message: "Please fill all fields",
    });
}
        //check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists", });
        }
        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        //Create User

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),


            });
        }
        else {
            res.status(400).json({
                message: "invalid user data",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });

    }

};
//Login User

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
            // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }
        //Find User
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({
                message: "Invalid email or password",

            });

        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
//Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (user) {

            res.json(user);

        } else {
            res.status(404).json({
                message: "User not Found",

            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }

};
// ================= UPDATE USER PROFILE =================
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
        message: "User not found",
      });
    }

    // Update fields
    user.name =
      req.body.name ||
      user.name;

    user.email =
      req.body.email ||
      user.email;

    user.skills =
      req.body.skills ||
      user.skills;

    user.education =
      req.body.education ||
      user.education;

    user.experience =
      req.body.experience ||
      user.experience;

    user.profilePic =
      req.body.profilePic ||
      user.profilePic;

    // Save updated user
    const updatedUser =
      await user.save();

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

       updatedUser: userResponse,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

    }
};

