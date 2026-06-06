import Application from "../models/Application.js";
import Job from "../models/Job.js";

/* ================= APPLY JOB ================= */
export const applyJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // prevent applying to own job
    if (
      job.createdBy &&
      job.createdBy.toString() === req.user._id.toString()
    ) {
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

    // ✅ FIX: proper resume URL handling
    const resumeUrl = req.file
      ? `${process.env.BACKEND_URL}/uploads/${req.file.filename}`
      : "";

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl,
      coverLetterUrl: req.body.coverLetterUrl || "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("APPLY JOB ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET MY APPLICATIONS ================= */
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
      .populate("job", "title location salary description")
      .populate("applicant", "name email skills experience education")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET JOB APPLICATIONS ================= */
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

    // only job owner
    if (
      !job.createdBy ||
      job.createdBy.toString() !== req.user._id.toString()
    ) {
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
    console.error("GET JOB APPLICATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE STATUS ================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "interview",
      "selected",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findById(applicationId).populate(
      "job"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // only job owner can update
    if (
      !application.job.createdBy ||
      application.job.createdBy.toString() !== req.user._id.toString()
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
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};