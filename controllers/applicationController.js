import Application from "../models/Application.js";
import Job from "../models/Job.js";

// ================= ROLE CHECK =================
const isJobseeker = (req) => req.user?.role === "jobseeker";
const isEmployer = (req) => req.user?.role === "employer";


// ================= APPLY JOB =================
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!isJobseeker(req)) {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can apply",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // prevent applying own job
    if (job.createdBy?.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot apply to your own job",
      });
    }

    // duplicate check
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl: req.file?.path || "",
      coverLetterUrl: req.body.coverLetterUrl || "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= MY APPLICATIONS =================
export const getMyApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate({
        path: "job",
        select: "title location salary description company createdBy",
      })
      .populate("applicant", "name email skills experience education")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= EMPLOYER APPLICATIONS =================
export const getEmployerApplications = async (req, res) => {
  try {
    if (!req.user || !isEmployer(req)) {
      return res.status(403).json({
        success: false,
        message: "Employer only",
      });
    }

    const applications = await Application.find()
      .populate({
        path: "job",
        match: { createdBy: req.user._id },
        select: "title location salary createdBy",
      })
      .populate("applicant", "name email phone skills experience education")
      .sort({ createdAt: -1 });

    const filtered = applications.filter(app => app.job !== null);

    return res.status(200).json({
      success: true,
      applications: filtered,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= JOB WISE APPLICATIONS =================
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email phone skills experience education")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= UPDATE STATUS (ATS FLOW) =================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewed",
      "interview",
      "accepted",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      application.job.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      application,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};