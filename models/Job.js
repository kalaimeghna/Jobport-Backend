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

    location: {
      type: String,
      required: true,
    },

    // KEEP STRING (safe for salary ranges like "3-5 LPA")
    salary: {
      type: String,
      required: true,
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