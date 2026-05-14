import Application from "../models/Application.js";
import Job from "../models/Job.js";


// ================= APPLY JOB =================

export const applyJob =
  async (req, res) => {
    try {

      const job =
        await Job.findById(
          req.params.jobId
        );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      // Check duplicate apply
      const alreadyApplied =
        await Application.findOne({
          applicant: req.user._id,
          job: req.params.jobId,
        });

      if (alreadyApplied) {
        return res.status(400).json({
          success: false,
          message:
            "Already applied",
        });
      }

      const application =
        await Application.create({
          applicant: req.user._id,
          job: req.params.jobId,
        });

      res.status(201).json({
        success: true,
        message:
          "Job applied successfully",
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

export const getMyApplications =
  async (req, res) => {
    try {

      const applications =
        await Application.find({
          applicant: req.user._id,
        }).populate("job");

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



// ================= GET JOB APPLICATIONS =================

export const getJobApplications =
  async (req, res) => {
    try {

      const applications =
        await Application.find({
          job: req.params.jobId,
        }).populate(
          "applicant",
          "name email"
        );

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

export const updateApplicationStatus =
  async (req, res) => {
    try {

      const application =
        await Application.findById(
          req.params.id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      application.status =
        req.body.status;

      await application.save();

      res.status(200).json({
        success: true,
        message:
          "Status updated",
        application,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };