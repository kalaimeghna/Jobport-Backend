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

    // ================= COMMON FIELDS =================
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;

    // ================= JOB SEEKER PROFILE =================
    user.headline = req.body.headline || user.headline;
    user.experience = req.body.experience || user.experience;
    user.education = req.body.education || user.education;

    if (req.body.skills) {
      try {
        user.skills = JSON.parse(req.body.skills);
      } catch {
        user.skills = req.body.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    if (req.body.resume) {
      user.resume = req.body.resume;
    }

    // ================= EMPLOYER PROFILE =================
    user.companyName =
      req.body.companyName || user.companyName;

    user.companyDescription =
      req.body.companyDescription ||
      user.companyDescription;

    user.companyLogo =
      req.body.companyLogo || user.companyLogo;

    user.companyLocation =
      req.body.companyLocation ||
      user.companyLocation;

    user.companyWebsite =
      req.body.companyWebsite ||
      user.companyWebsite;

    user.industry =
      req.body.industry || user.industry;

    // ================= PROFILE PICTURE =================
    if (req.file) {
      user.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    const safeUser = await User.findById(updatedUser._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= GET USER BY ID =================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password"
    );

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