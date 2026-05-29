import Application from "../models/Application.js";
import Job from "../models/Job.js";

// ================= APPLY FOR JOB =================
export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // check job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // prevent duplicate application
    const alreadyApplied = await Application.findOne({
      job: jobId,
      user: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
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

// ================= GET MY APPLICATIONS (JOB SEEKER) =================
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

// ================= GET APPLICATIONS FOR EMPLOYER =================
export const getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

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

    // validate status
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

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
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
        match: { employer: employerId },
      })
      .populate("user", "name email");

    // remove non-matching jobs
    const filtered = applications.filter(
      (app) => app.job !== null
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