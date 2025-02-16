// backend/routes/examRoutes.js
import express from "express";
import Exam from "../models/Exam.js";

const router = express.Router();

// Get all exams
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new exam
router.post("/create", async (req, res) => {
  try {
    const { subject, date, duration } = req.body;

    // Validate required fields
    if (!subject || !date || !duration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newExam = new Exam({ subject, date, duration });
    await newExam.save();

    res.status(201).json({ message: "Exam created successfully!", newExam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an exam
router.delete("/:id", async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: "Exam deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
