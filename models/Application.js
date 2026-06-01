import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ================= JOB =================
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ================= APPLICANT =================
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ================= RESUME =================
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // ================= COVER LETTER =================
    coverLetterUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= STATUS (FIXED - IMPORTANT) =================
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "interview",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;