import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import students from "./routes/students.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Test API endpoint
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/students", students);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({ error: err.message });
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
