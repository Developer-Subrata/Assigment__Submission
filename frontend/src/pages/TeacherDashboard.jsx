import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TeacherDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const createTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter both title and description.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/create-task", {
        title,
        description,
        assignedBy: "Teacher",
      });
      alert("Task assigned successfully!");
      setTitle("");
      setDescription("");
      fetchTasks(); // Fetch updated task list
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task.");
    }
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index][field] = value;
      return updatedQuestions;
    });
  };

  const updateOption = (qIndex, oIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[qIndex].options[oIndex] = value;
      return updatedQuestions;
    });
  };

  const createExam = async () => {
    if (!examTitle.trim() || questions.length === 0) {
      alert("Please enter an exam title and at least one question.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/create-exam", {
        title: examTitle,
        questions,
      });
      alert(`Exam Created! Code: ${res.data.examCode}`);
      setExamTitle("");
      setQuestions([]);
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Failed to create exam.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Teacher Dashboard</h2>

      {/* Assign Task Section */}
      <div className="card p-4 mb-4 shadow-sm">
        <h4>Assign Task</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button className="btn btn-primary" onClick={createTask}>
          Assign Task
        </button>
      </div>

      {/* Task List */}
      <div className="mb-4">
        <h4>Assigned Tasks</h4>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="border p-3 mb-2 shadow-sm">
              <h5>{task.title}</h5>
              <p>{task.description}</p>
            </div>
          ))
        ) : (
          <p>No tasks assigned yet.</p>
        )}
      </div>

      {/* Create Exam Section */}
      <div className="card p-4 shadow-sm">
        <h4>Create Exam</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Exam Title"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
        />
        {questions.map((q, index) => (
          <div key={index} className="mb-3 p-3 border rounded shadow-sm">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Question"
              value={q.question}
              onChange={(e) => updateQuestion(index, "question", e.target.value)}
            />
            {q.options.map((opt, i) => (
              <input
                key={i}
                type="text"
                className="form-control mb-2"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(index, i, e.target.value)}
              />
            ))}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Correct Answer"
              value={q.answer}
              onChange={(e) => updateQuestion(index, "answer", e.target.value)}
            />
          </div>
        ))}
        <button className="btn btn-secondary me-2" onClick={addQuestion}>
          Add Question
        </button>
        <button className="btn btn-success" onClick={createExam}>
          Create Exam
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
