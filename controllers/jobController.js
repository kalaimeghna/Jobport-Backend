import Job from "../models/Job.js";
import Company from "../models/Company.js";

// ================= CREATE JOB =================
export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, company } = req.body;

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL JOBS =================
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "companyName logo location")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET SINGLE JOB =================
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({ success: true, job });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= MY JOBS =================
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id })
      .populate("company");

    res.json({ success: true, jobs });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE JOB =================
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(job, req.body);

    const updated = await job.save();

    res.json({ success: true, job: updated });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE JOB =================
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= RECOMMENDED JOBS (FIXED ERROR) =================
export const getRecommendedJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .limit(10)
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