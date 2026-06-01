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

    // ================= JOB SEEKER PROFILE =================
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

    location: {
      type: String,
      default: "",
    },

    headline: {
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