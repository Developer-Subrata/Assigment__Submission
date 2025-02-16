import express from "express";
import Student from "../models/Students.js";

const router = express.Router();

// Add a student
router.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Update a student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
