import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// ================= ROLE CHECK =================
const isEmployer = (req) => req.user?.role === "employer";

// ================= CREATE JOB =================
export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, company } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can create jobs",
      });
    }

    if (!title || !description || !location || !salary || !company) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      company,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL JOBS =================
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "companyName logo location")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY JOBS (EMPLOYER) =================
export const getMyJobs = async (req, res) => {
  try {
    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can access this",
      });
    }

    const jobs = await Job.find({ createdBy: req.user._id })
      .populate("company", "companyName logo location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET JOB BY ID =================
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "companyName logo location description website")
      .populate("createdBy", "name email role");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE JOB =================
export const updateJob = async (req, res) => {
  try {
    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can update jobs",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.location = req.body.location || job.location;
    job.salary = req.body.salary || job.salary;

    const updatedJob = await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE JOB =================
export const deleteJob = async (req, res) => {
  try {
    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Only employers can delete jobs",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RECOMMENDED JOBS =================
export const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const skills = user?.skills || [];

    const jobs = await Job.find()
      .populate("company", "companyName logo location")
      .sort({ createdAt: -1 });

    const recommended = jobs.filter((job) =>
      skills.some((skill) =>
        job.title.toLowerCase().includes(skill.toLowerCase()) ||
        job.description.toLowerCase().includes(skill.toLowerCase())
      )
    );

    res.status(200).json({
      success: true,
      jobs: recommended,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= EMPLOYER DASHBOARD =================
export const getEmployerJobs = async (req, res) => {
  try {
    if (!isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const jobs = await Job.find({ createdBy: req.user._id });

    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    applications.forEach((a) => {
      countMap[a._id.toString()] = a.count;
    });

    const jobsWithApplicants = jobs.map((job) => ({
      ...job.toObject(),
      applicantsCount: countMap[job._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      jobs: jobsWithApplicants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};