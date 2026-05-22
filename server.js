import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
//middleware
app.use(express.json());


// ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/company", companyRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/users", userRoutes);


// HOME ROUTE

app.get("/", (req, res) => {

  res.send("API Running");

});
// ERROR MIDDLEWARE

app.use(notFound);

app.use(errorHandler);



// PORT

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});