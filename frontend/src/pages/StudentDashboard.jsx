// pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [examCode, setExamCode] = useState("");
  const [submittedText, setSubmittedText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  const submitTask = async (taskId) => {
    if (!submittedText[taskId] || submittedText[taskId].trim() === "") {
      alert("Please enter your response before submitting.");
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/submit-task/${taskId}`, {
        studentName: "Student",
        submittedText: submittedText[taskId],
      });
      alert("Task submitted successfully!");
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("Failed to submit task. Please try again.");
    }
  };

  const enterExam = () => {
    if (!examCode.trim()) {
      alert("Please enter a valid exam code.");
      return;
    }
    navigate(`/exam/${examCode}`);
  };

  return (
    <div>
      <h2>Student Dashboard</h2>

      <h3>Assigned Tasks</h3>
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task._id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid black" }}>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <textarea
              placeholder="Submit your task here..."
              value={submittedText[task._id] || ""}
              onChange={(e) => setSubmittedText({ ...submittedText, [task._id]: e.target.value })}
              style={{ width: "100%", height: "80px" }}
            />
            <button onClick={() => submitTask(task._id)} style={{ marginTop: "5px" }}>Submit Task</button>
          </div>
        ))
      ) : (
        <p>No tasks assigned yet.</p>
      )}

      <h3>Enter Exam</h3>
      <input
        type="text"
        placeholder="Enter Exam Code"
        value={examCode}
        onChange={(e) => setExamCode(e.target.value)}
      />
      <button onClick={enterExam}>Start Exam</button>
    </div>
  );
};

export default StudentDashboard;
