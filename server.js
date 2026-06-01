import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ERROR MIDDLEWARE
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// ================= DB CONNECTION =================
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  });

// ================= SECURITY =================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ================= CORS =================
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked this origin: " + origin));
    },
    credentials: true,
  })
);

// ================= BODY PARSER =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES (IMPORTANT FOR RESUME) =================
app.use("/uploads", express.static("uploads"));

// ================= REQUEST LOGGER =================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/users", userRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Portal API Running 🚀",
  });
});

// ================= 404 HANDLER =================
app.use(notFound);

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});