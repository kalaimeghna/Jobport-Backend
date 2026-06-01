import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // ================= JOB BASICS =================
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
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote"],
      default: "Full-Time",
    },

    experienceLevel: {
      type: String,
      default: "",
    },

    applicationDeadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    // ================= RELATIONS =================
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);