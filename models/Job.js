import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      index: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      default: "",
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"],
      default: "Full-Time",
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid-Level", "Senior", "Lead"],
      default: "Fresher",
    },

    applicationDeadline: {
      type: Date,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);