import express from "express";
import Exam from "../models/Exam.js";

const router = express.Router();

// Create a new exam
router.post("/create-exam", async (req, res) => {
  try {
    const { title, questions } = req.body;
    
    if (!title || !Array.isArray(questions)) {
      return res.status(400).json({ error: "❌ Title and questions are required" });
    }

    const examCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    const newExam = new Exam({ title, questions, examCode });

    await newExam.save();
    console.log("✅ Exam Created:", newExam);

    res.json({ message: "✅ Exam created successfully", examCode });
  } catch (error) {
    console.error("❌ Exam Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch an exam
router.get("/get-exam/:examCode", async (req, res) => {
  try {
    const exam = await Exam.findOne({ examCode: req.params.examCode });
    if (!exam) return res.status(404).json({ error: "❌ Exam not found" });

    res.json(exam);
  } catch (error) {
    console.error("❌ Exam Fetching Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
