import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  const [showForms, setShowForms] = useState({ student: false, task: false, exam: false });
  const [showLists, setShowLists] = useState({ student: false, task: false, exam: false });

  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [newExam, setNewExam] = useState({ subject: "", date: "", duration: "" });
  const [newStudent, setNewStudent] = useState({ name: "", email: "", mobile: "", course: "", duration: "", batch: "", rollNo: "", password: "" });

  // Fetch Data on Component Mount
  const fetchData = useCallback(async () => {
    try {
      const [taskRes, examRes, studentRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks"),
        axios.get("http://localhost:5000/api/exams"),
        axios.get("http://localhost:5000/api/students"),
      ]);
      setTasks(taskRes.data);
      setExams(examRes.data);
      setStudents(studentRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e, setter) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e, data, url, setter, successMessage) => {
    e.preventDefault();
    try {
      await axios.post(url, data);
      alert(successMessage);
      setter(prev => Object.fromEntries(Object.keys(prev).map(key => [key, ""])));
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      alert("Operation failed.");
    }
  };

  const handleDelete = async (id, url, successMessage) => {
    try {
      await axios.delete(`${url}/${id}`);
      alert(successMessage);
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete.");
    }
  };

  const toggleSection = (type, setState) => setState(prev => ({ ...prev, [type]: !prev[type] }));

  return (
    <div className="dashboard-container">
      <h2>Teacher Dashboard</h2>
      
      {[ 
        { type: "student", title: "Add New Student", fields: newStudent, setFields: setNewStudent,
                         url: "http://localhost:5000/api/students/add", successMessage: "Student added successfully!" },
        { type: "task", title: "Assign a Task", fields: newTask, setFields: setNewTask,
                         url: "http://localhost:5000/api/tasks/assign", successMessage: "Task assigned successfully!" },
        { type: "exam", title: "Create an Exam", fields: newExam, setFields: setNewExam,
                         url: "http://localhost:5000/api/exams/create", successMessage: "Exam created successfully!" }
      ].map(({ type, title, fields, setFields, url, successMessage }) => (
        <div key={type} className="form-section">
          <h3 onClick={() => toggleSection(type, setShowForms)} style={{ cursor: "pointer" }}>
            {title} {showForms[type] ? "▲" : "▼"}
          </h3>
          {showForms[type] && (
            <form onSubmit={(e) => handleSubmit(e, fields, url, setFields, successMessage)}>
              {Object.keys(fields).map(field => (
                <input
                  key={field}
                  type={field.toLowerCase().includes("date") ? "date" : field === "password" ? "password" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={fields[field]}
                  onChange={(e) => handleChange(e, setFields)}
                  required
                />
              ))}
              <button className="action-btn" type="submit">{title.split(" ")[0]}</button>
            </form>
          )}
        </div>
      ))}
      
      {[ 
        { type: "student", title: "Students List", data: students, url: "http://localhost:5000/api/students", itemFormat: item => `${item.name} - ${item.course} - Batch: ${item.batch} - Roll No: ${item.rollNo}` },
        { type: "task", title: "Assigned Tasks", data: tasks, url: "http://localhost:5000/api/tasks", itemFormat: item => `${item.title} - Due: ${item.dueDate}` },
        { type: "exam", title: "Scheduled Exams", data: exams, url: "http://localhost:5000/api/exams", itemFormat: item => `${item.subject} - ${new Date(item.date).toLocaleDateString()} - ${item.duration} hours` }
      ].map(({ type, title, data, url, itemFormat }) => (
        <div key={type} className="list-section">
          <h3 onClick={() => toggleSection(type, setShowLists)} style={{ cursor: "pointer" }}>
            {title} {showLists[type] ? "▲" : "▼"}
          </h3>
          {showLists[type] && (
            <ul>
              {data.map(item => (
                <li key={item._id}>{itemFormat(item)}
                  <button className="delete-btn" onClick={() => handleDelete(item._id, url, `${title.split(" ")[0]} deleted successfully!`)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherDashboard;
