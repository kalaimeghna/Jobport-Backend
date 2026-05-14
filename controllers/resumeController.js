import Resume from "../models/Resume.js";
import cloudinary from "../utils/cloudinary.js";

// UPLOAD RESUME
export const uploadResume = async (req, res) => {
  try {
    // Check file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "raw",
        folder: "jobportal/resumes",
      }
    );

    // Save in DB
    const resume = await Resume.create({
      user: req.user._id,
      resumeUrl: result.secure_url,
      public_id: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER RESUMES
export const getResume = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE RESUME
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(
      req.params.id
    );

    // Check resume exists
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Authorization check
    if (
      resume.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(
      resume.public_id,
      {
        resource_type: "raw",
      }
    );

    // Delete from MongoDB
    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};