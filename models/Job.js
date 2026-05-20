import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    requirements: [String],

    location: String,

    salary: Number,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Job",
  jobSchema
);