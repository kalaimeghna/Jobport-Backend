import Job from "../models/Job.js";
import User from "../models/User.js";

// ================= CREATE JOB =================
export const createJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Only employers can create jobs",
      });
    }

    const {
      title,
      description,
      requirements,
      skills,
      location,
      salary,
      jobType,
      experienceLevel,
      applicationDeadline,
      company,
    } = req.body;

    if (!title || !description || !location || !company) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements,
      skills,
      location,
      salary,
      jobType,
      experienceLevel,
      applicationDeadline,
      company,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL JOBS =================
export const getJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { skills: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("company", "companyName logo location industry")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET JOB BY ID =================
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate(
        "company",
        "companyName logo description location website industry companySize foundedYear"
      )
      .populate("createdBy", "name email role");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("GET JOB BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY JOBS =================
export const getMyJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const jobs = await Job.find({
      createdBy: req.user._id,
    })
      .populate("company", "companyName logo location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("GET MY JOBS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE JOB =================
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!req.user || job.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("company", "companyName logo location");

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE JOB =================
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!req.user || job.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RECOMMENDED JOBS =================
export const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let jobs = [];

    const skills = user?.skills || [];

    if (skills.length > 0) {
      jobs = await Job.find({
        $or: [
          ...skills.map((skill) => ({
            title: { $regex: skill, $options: "i" },
          })),
          ...skills.map((skill) => ({
            skills: { $regex: skill, $options: "i" },
          })),
        ],
      })
        .populate("company", "companyName logo location")
        .sort({ createdAt: -1 })
        .limit(10);
    }

    if (!jobs.length) {
      jobs = await Job.find()
        .populate("company", "companyName logo location")
        .sort({ createdAt: -1 })
        .limit(10);
    }

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("RECOMMENDED JOBS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};