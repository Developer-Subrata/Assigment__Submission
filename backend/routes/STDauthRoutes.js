import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/Students.js"; // Ensure correct model import

dotenv.config(); // Load environment variables

const router = express.Router();

// Student Login Route
router.post("/STDlogin", async (req, res) => {
  try {
    const { rollNo, password } = req.body;
    console.log("Received Login Data:", { rollNo, password }); // 🟢 Debug Log

    if (!rollNo || !password) {
      return res.status(400).json({ success: false, message: "Roll number and password are required" });
    }

    const student = await Student.findOne({ rollNo });
    console.log("Found Student:", student); // 🟢 Debug Log

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.password !== password) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: student._id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        name: student.name,
        rollNo: student.rollNo,
        course: student.course,
        batch: student.batch,
      },
    });
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
