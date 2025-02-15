import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Assign a task
router.post("/assign-task", async (req, res) => {
  try {
    const { title, description, assignedBy } = req.body;

    if (!title || !description || !assignedBy) {
      return res.status(400).json({ error: "❌ All fields are required" });
    }

    const newTask = new Task({ title, description, assignedBy });
    await newTask.save();

    console.log("✅ Task Assigned:", newTask);
    res.json({ message: "✅ Task assigned successfully" });
  } catch (error) {
    console.error("❌ Task Assignment Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Submit a task
router.post("/submit-task/:taskId", async (req, res) => {
  try {
    const { studentName, submittedText } = req.body;

    if (!studentName || !submittedText) {
      return res.status(400).json({ error: "❌ Both studentName and submittedText are required" });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: "❌ Task not found" });

    task.studentResponses.push({ studentName, submittedText, reviewed: false });
    await task.save();

    console.log("✅ Task Submitted:", task);
    res.json({ message: "✅ Task submitted successfully" });
  } catch (error) {
    console.error("❌ Task Submission Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
