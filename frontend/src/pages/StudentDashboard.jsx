import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [mcqExam, setMcqExam] = useState([]);
  const [mcqResponses, setMcqResponses] = useState({});

  useEffect(() => {
    fetchTasks();
    fetchMcqExam();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchMcqExam = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/exams");
      setMcqExam(res.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const handleSubmitTask = async (taskId) => {
    if (!submittedText.trim()) {
      alert("Please enter your response before submitting.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/tasks/submit", {
        taskId,
        submittedText,
      });
      alert("Task submitted successfully!");
      setSubmittedText("");
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleMcqResponse = (questionId, answer) => {
    setMcqResponses((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitExam = async () => {
    try {
      await axios.post("http://localhost:5000/api/exams/submit", {
        responses: mcqResponses,
      });
      alert("Exam submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Student Dashboard</h2>

      <div className="mb-4">
        <h4>Assignments</h4>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="card p-3 mb-2 shadow-sm">
              <h5>{task.title}</h5>
              <p>{task.description}</p>
              <textarea
                className="form-control mb-2"
                placeholder="Your Response"
                value={submittedText}
                onChange={(e) => setSubmittedText(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSubmitTask(task._id)}
              >
                Submit
              </button>
            </div>
          ))
        ) : (
          <p>No assignments available.</p>
        )}
      </div>

      <div className="card p-4 shadow-sm">
        <h4>MCQ Exam</h4>
        {mcqExam.length > 0 ? (
          mcqExam.map((q, index) => (
            <div key={index} className="p-3 mb-2">
              <h5>{q.question}</h5>
              {q.options.map((option, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    name={q._id}
                    value={option}
                    onChange={() => handleMcqResponse(q._id, option)}
                  />
                  {" "}
                  {option}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No exams available.</p>
        )}
        <button className="btn btn-success mt-3" onClick={handleSubmitExam}>
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
