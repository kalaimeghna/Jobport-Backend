import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ================= ROLE =================
    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },

    // ================= CONTACT =================
    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // ================= JOB SEEKER PROFILE =================
    headline: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    // ================= FILES =================
    profilePicture: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    // ================= EMPLOYER PROFILE =================
    companyName: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },

    companyLogo: {
      type: String,
      default: "",
    },

    companyLocation: {
      type: String,
      default: "",
    },

    companyWebsite: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    // ================= PASSWORD RESET =================
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;