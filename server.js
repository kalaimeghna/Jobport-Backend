import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
// Route Imports

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";



dotenv.config();
//DB Connection
connectDB();

const app = express();
//Middleware
app.use(express.json());
app.use(cors());

//Test Route
app.get("/", (req, res) => {
    res.send("API Running");
});

//========== Routes=============
//Auth APIs
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//Job APIs

app.use("/api/jobs", jobRoutes);
//Application Apis
app.use("/api/applications", applicationRoutes);

//Resume Apis
app.use("/api/resume", resumeRoutes);
//Company apis

app.use("/api/company", companyRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});

