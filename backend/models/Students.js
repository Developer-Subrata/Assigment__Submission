import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  course: { type: String, required: true },
  duration: { type: String, required: true },
  batch: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Student = mongoose.model("Student", StudentSchema, "students"); 
export default Student;
