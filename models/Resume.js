import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      enum: ["pdf", "doc", "docx"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", resumeSchema);