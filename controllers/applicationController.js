import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";


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

          message:
            "Job not found",

        });
      }


      // CHECK ALREADY APPLIED

      const alreadyApplied =
        await Application.findOne({

          applicant:
            req.user._id,

          job:
            req.params.jobId,

        });

      if (alreadyApplied) {

        return res.status(400).json({

          success: false,

          message:
            "Already applied",

        });
      }


      // CREATE APPLICATION

      const application =
        await Application.create({

          applicant:
            req.user._id,

          job:
            req.params.jobId,

          status:
            "Applied",

        });

      res.status(201).json({

        success: true,

        message:
          "Job applied successfully",

        application,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= GET MY APPLICATIONS =================

export const getMyApplications =
  async (req, res) => {

    try {

      const applications =
        await Application.find({

          applicant:
            req.user._id,

        }).populate("job");

      res.status(200).json({

        success: true,

        applications,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= GET EMPLOYER APPLICATIONS =================

export const getEmployerApplications =
  async (req, res) => {

    try {

      const jobs =
        await Job.find({

          createdBy:
            req.user._id,

        });

      const jobIds =
        jobs.map(
          (job) => job._id
        );

      const applications =
        await Application.find({

          job: {
            $in: jobIds,
          },

        })

        .populate(

          "applicant",

          "name email phone skills experience"

        )

        .populate(

          "job",

          "title location salary"

        );

      res.status(200).json({

        success: true,

        applications,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };


// ================= GET JOB APPLICATIONS =================

export const getJobApplications =
  async (req, res) => {

    try {

      const applications =
        await Application.find({

          job:
            req.params.jobId,

        }).populate({

          path: "applicant",

          select:
            "name email phone skills experience",

        });

      // ================= ADD RESUME URL =================

      const updatedApplications =
        await Promise.all(

          applications.map(
            async (app) => {

              if (!app.applicant) {
                return null;
              }

              const resume =
                await Resume.findOne({

                  user:
                    app.applicant._id,

                }).sort({

                  createdAt: -1,

                });

              return {

                ...app._doc,

                applicant: {

                  ...app.applicant._doc,

                  resumeUrl:
                    resume?.resumeUrl || "",

                },

              };
            }
          )
        );

      const filteredApplications =
        updatedApplications.filter(Boolean);

      res.status(200).json({

        success: true,

        applications:
          filteredApplications,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

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
          "Status updated successfully",

        application,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });
    }
  };