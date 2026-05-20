import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      enum: ["jobseeker", "employer"],
    },

    skills: [String],

    education: String,

    experience: String,

    profilePic: String,
    
    resetPasswordToken: String,

    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);