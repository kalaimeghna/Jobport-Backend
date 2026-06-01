import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "jobportal/resumes",
    allowed_formats: ["pdf"],
  },
});

const upload = multer({ storage });

export default upload;