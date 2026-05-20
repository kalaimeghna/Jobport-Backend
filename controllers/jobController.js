import Job from "../models/Job.js";

import User from "../models/User.js";


// ================= CREATE JOB =================

export const createJob =
  async (req, res) => {

    try {

      const {
        title,
        description,
        requirements,
        location,
        salary,
      } = req.body;


      const job =
        await Job.create({

          title,

          description,

          requirements,

          location,

          salary,

          createdBy:
            req.user._id,

        });


      res.status(201).json({

        success: true,

        message:
          "Job created successfully",

        job,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }
};


// ================= GET ALL JOBS =================

export const getJobs =
  async (req, res) => {

    try {

      const jobs =
        await Job.find()

          .populate(
            "createdBy",
            "name email"
          )

          .sort({
            createdAt: -1,
          });


      res.status(200).json({

        success: true,

        jobs,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }
};


// ================= GET SINGLE JOB =================

export const getJobById =
  async (req, res) => {

    try {

      const job =
        await Job.findById(
          req.params.id
        ).populate(
          "createdBy",
          "name email"
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      res.status(200).json({

        success: true,

        job,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }
};


// ================= UPDATE JOB =================

export const updateJob =
  async (req, res) => {

    try {

      const job =
        await Job.findById(
          req.params.id
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      // CHECK OWNER

      if (
        job.createdBy.toString() !==
        req.user._id.toString()
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      const updatedJob =
        await Job.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }
        );


      res.status(200).json({

        success: true,

        message:
          "Job updated successfully",

        job: updatedJob,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }
};


// ================= DELETE JOB =================

export const deleteJob =
  async (req, res) => {

    try {

      const job =
        await Job.findById(
          req.params.id
        );


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      // CHECK OWNER

      if (
        job.createdBy.toString() !==
        req.user._id.toString()
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      await job.deleteOne();


      res.status(200).json({

        success: true,

        message:
          "Job deleted successfully",

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }
};


// ================= RECOMMENDED JOBS =================

export const getRecommendedJobs =
  async (req, res) => {

    try {

      const userSkills =
        req.user.skills || [];

      const jobs =
        await Job.find();

      const recommendedJobs =
        jobs.filter((job) => {

          const requirements =
            Array.isArray(
              job.requirements
            )

              ? job.requirements

              : String(
                  job.requirements
                ).split(",");

          return requirements.some(
            (skill) =>

              userSkills.includes(
                skill.trim()
              )
          );
        });

      res.status(200).json({

        success: true,

        jobs: recommendedJobs,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch recommended jobs",

      });

    }
};