import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// ================= ROLE CHECK =================
const isEmployer = (req) => req.user?.role === "employer";

/**
 * ================= CREATE JOB =================
 */
export const createJob = async (req, res) => {
  try {
    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can create jobs",
      });
    }

    const { title, description, location, salary, company } = req.body;

    if (!title || !description || !location || !company) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      company,
      postedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================= GET ALL JOBS =================
 */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company")
      .populate("postedBy", "name email");

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================= GET JOB BY ID =================
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================= GET MY JOBS (EMPLOYER) =================
 */
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================= UPDATE JOB =================
 */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // only owner can update
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json({
      success: true,
      job: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================= DELETE JOB =================
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    return res.json({
      success: true,
      message: "Job deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================= RECOMMENDED JOBS =================
 * (SAFE VERSION - NO CRASH)
 */
export const getRecommendedJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    // Get user profile
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Simple recommendation logic:
    // match jobs by skills OR show latest jobs fallback

    let jobs = [];

    if (user.skills && user.skills.length > 0) {
      jobs = await Job.find({
        $or: user.skills.map((skill) => ({
          title: { $regex: skill, $options: "i" },
        })),
      })
        .populate("company")
        .limit(10);
    }

    // fallback if no matches
    if (jobs.length === 0) {
      jobs = await Job.find()
        .populate("company")
        .sort({ createdAt: -1 })
        .limit(10);
    }

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ================= EMPLOYER JOBS =================
 */
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};