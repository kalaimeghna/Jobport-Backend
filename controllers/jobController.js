import Job from "../models/Job.js";


export const createJob = async(req, res)=>{
    try{
        const{
            title,
            description,
            requirements,
            location,
            salary,
}=req.body;
//validation
if(!title || !description || !requirements || !location || !salary){
    return res.status(400).json({
        success:false,
        message:"please fill all required filelds",

    });
}
//create job
const job = await Job.create({
    title,
    description,
    requirements,
    location,
    salary,
    createdBy:req.user._id,
});
res.status(201).json({
    success:true,
    job,
});
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
});
    }
};
//get Jobs
export const getJobs = async (req, res)=>{
    try{
        const jobs = await Job.find().populate(
  "createdBy",
  "name email"
);
        res.status(200).json({
            success:true,
            jobs,
        }); 
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
// ================= GET SINGLE JOB =================

export const getSingleJob =
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
          message: "Job not found",
        });
      }

      // Check owner
      if (
        job.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Not authorized",
        });
      }

      job.title =
        req.body.title || job.title;

      job.description =
        req.body.description ||
        job.description;

      job.requirements =
        req.body.requirements ||
        job.requirements;

      job.location =
        req.body.location ||
        job.location;

      job.salary =
        req.body.salary ||
        job.salary;

      const updatedJob =
        await job.save();

      res.status(200).json({
        success: true,
        updatedJob,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
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
          message: "Job not found",
        });
      }

      // Check owner
      if (
        job.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
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

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };
  // ================= RECOMMENDED JOBS =================
export const getRecommendedJobs =
async (req, res) => {
  try {

    // Get logged-in user
    const user = req.user;

    // Find jobs matching skills
    const jobs = await Job.find({
      requirements: {
        $regex:
          user.skills.join("|"),
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      recommendedJobs: jobs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};