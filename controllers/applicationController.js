import Application from "../models/Application.js";
import Job from "../models/Job.js";

// ================= APPLY FOR JOB =================
export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ❌ ONLY JOBSEEKER CAN APPLY
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can apply for jobs",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      user: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    const application = await Application.create({
      job: jobId,
      user: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      application,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY APPLICATIONS =================
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET JOB APPLICATIONS (EMPLOYER) =================
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ❌ ONLY JOB OWNER CAN VIEW
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("user", "name email role")
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE APPLICATION STATUS =================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const allowedStatuses = [
      "pending",
      "interviewed",
      "accepted",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ❌ ONLY JOB OWNER CAN UPDATE
    if (
      application.job.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      application,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET EMPLOYER APPLICATIONS =================
export const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user._id;

    const applications = await Application.find()
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      })
      .populate("user", "name email role");

    // filter only employer's jobs
    const filtered = applications.filter(
      (app) =>
        app.job &&
        app.job.createdBy.toString() === employerId.toString()
    );

    res.status(200).json({
      success: true,
      applications: filtered,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};