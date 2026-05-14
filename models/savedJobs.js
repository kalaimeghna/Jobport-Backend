import mongoose from "mongoose";

const savedJobSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      job: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Job",
      },
    },
    { timestamps: true }
  );

export default mongoose.model(
  "SavedJob",
  savedJobSchema
);