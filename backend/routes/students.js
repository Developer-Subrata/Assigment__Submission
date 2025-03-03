import express from "express";
import Student from "../models/Students.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password if using Gmail
  },
});

// Add a student with email notification
router.post("/add", async (req, res) => {
  try {
    const { name, email, mobile, course, duration, batch, rollNo, password } = req.body;

    const student = new Student({
      name,
      email,
      mobile,
      course,
      duration,
      batch,
      rollNo,
      password,
    });

    await student.save();

    // Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Your Course",
      text: `Hello ${name},\n\nYou have been successfully registered for the ${course} course.\n\nBatch: ${batch}\nEmail: ${email}\nRoll No: ${rollNo}\nDuration: ${duration}\n\nYour Login Credentials:\nRoll No: ${rollNo}\nPassword: ${password}\n\nBest Regards,\nYour Institution`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Student added and email sent successfully!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Update student details with email notification
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Email notification for update
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: "Your Student Details Updated",
      text: `Hello ${student.name},\n\nYour student details have been updated successfully.\n\nUpdated Details:\n${JSON.stringify(req.body, null, 2)}\n\nBest Regards,\nYour Institution`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Student updated and email sent!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve students." });
  }
});
//fetched by rollno
router.get("/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.params.rollNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve student details." });
  }
});


// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create an exam and notify students
router.post("/create-exam", async (req, res) => {
  try {
    const { examName, date, time, duration, course } = req.body;

    // Fetch students in the course
    const students = await Student.find({ course });

    if (students.length === 0) {
      return res.status(400).json({ error: "No students found for this course." });
    }

    // Send email to each student separately
    for (const student of students) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: "Upcoming Exam Notification",
        text: `Dear ${student.name},\n\nAn exam has been scheduled.\n\nExam: ${examName}\nDate: ${date}\nTime: ${time}\nDuration: ${duration} minutes\n\nBest Regards,\nYour Institution`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: "Exam created and notifications sent!" });
  } catch (error) {
    console.error("Error sending exam notification:", error);
    res.status(500).json({ error: "Failed to send exam notification." });
  }
});

// Assign a task and notify students
router.post("/assign-task", async (req, res) => {
  try {
    const { taskName, description, deadline, course } = req.body;

    // Fetch students in the course
    const students = await Student.find({ course });

    if (students.length === 0) {
      return res.status(400).json({ error: "No students found for this course." });
    }

    // Send email to each student separately
    for (const student of students) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: "New Task Assigned",
        text: `Dear ${student.name},\n\nA new task has been assigned to you.\n\nTask: ${taskName}\nDescription: ${description}\nDeadline: ${deadline}\n\nPlease complete it on time.\n\nBest Regards,\nYour Institution`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: "Task assigned and notifications sent!" });
  } catch (error) {
    console.error("Error sending task notification:", error);
    res.status(500).json({ error: "Failed to send task notification." });
  }
});

export default router;