import User from "../models/User.js";

// ================= GET CURRENT USER PROFILE =================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= UPDATE USER PROFILE =================
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.experience = req.body.experience || user.experience;
    user.education = req.body.education || user.education;

    // Skills from frontend are sent as JSON string
    if (req.body.skills) {
      try {
        user.skills = JSON.parse(req.body.skills);
      } catch {
        user.skills = req.body.skills
          .split(",")
          .map((skill) => skill.trim());
      }
    }

    // Profile Image Upload
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= GET USER BY ID =================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};