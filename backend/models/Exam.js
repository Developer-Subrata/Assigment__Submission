// backend/models/Exam.js
import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: { type: Array, required: true },
  examCode: { type: String, unique: true, required: true },
});

const Exam = mongoose.model("Exam", examSchema);
export default Exam;

