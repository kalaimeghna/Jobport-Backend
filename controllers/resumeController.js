import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";

const getUserId = (req) => req.user?.id || req.user?._id;

// ================= UPLOAD =================
export const uploadResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobportal/resumes",
      resource_type: "auto",
    });

    const resume = await Resume.create({
      user: userId,
      resumeUrl: result.secure_url,
      public_id: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET =================
export const getMyResumes = async (req, res) => {
  try {
    const userId = getUserId(req);

    const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE =================
export const deleteResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (resume.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await cloudinary.uploader.destroy(resume.public_id);

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};