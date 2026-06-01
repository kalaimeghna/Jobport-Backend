import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ================= JOB =================
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    // ================= APPLICANT =================
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ================= RESUME =================
    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= COVER LETTER =================
    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["pending", "reviewed", "interview", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;