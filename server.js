import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import connectDB from "./config/db.js";

// ================= ROUTES =================
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// ================= SECURITY =================
app.use(helmet());

// ================= BODY PARSER =================
app.use(express.json());

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://jobweb-frontend-792y.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ================= STATIC FILES (UPLOADS FIX) =================
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running 🚀",
  });
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/companies", companyRoutes);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();