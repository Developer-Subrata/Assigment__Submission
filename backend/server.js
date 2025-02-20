import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import STDauthRoutes from "./routes/STDauthRoutes.js";
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

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASSWORD, // Replace with your email password
  },
});

// Test API endpoint
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/STDauth", STDauthRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/students", students);

// Endpoint to send email
app.post("/api/send-email", async (req, res) => {
  const { email, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({ error: err.message });
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
