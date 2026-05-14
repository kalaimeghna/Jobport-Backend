import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    status: {
      type: String,
      enum: [
    "Applied",
    "Reviewing",
    "Interview",
    "Selected",
    "Rejected",
  ],

      default: "Applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Application",
  applicationSchema
);