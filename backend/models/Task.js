import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedBy: { type: String, required: true },
  studentResponses: [
    {
      studentName: { type: String, required: true },
      submittedText: { type: String, required: true },
      reviewed: { type: Boolean, default: false },
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
