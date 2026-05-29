import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    logo: {
      type: String,
    },

    location: {
      type: String,
    },

    website: {
      type: String,
    },

    industry: {
      type: String,
    },

    companySize: {
      type: String,
    },

    foundedYear: {
      type: Number,
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

export default mongoose.model("Company", companySchema);