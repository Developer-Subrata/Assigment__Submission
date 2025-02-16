// backend/models/Exam.js
import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
});

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
