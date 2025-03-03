import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import the xlsx library
import "./TeacherDashboard.css";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  const [showForms, setShowForms] = useState({ student: false, task: false, exam: false });
  const [showLists, setShowLists] = useState({ student: false, task: false, exam: false });

  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [newExam, setNewExam] = useState({ subject: "", date: "", duration: "" });
  const [newStudent, setNewStudent] = useState({ name: "", email: "", mobile: "", course: "", duration: "", batch: "", rollNo: "", password: "" });

  const [editingTask, setEditingTask] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingExam, setEditingExam] = useState(null);

  // Fetch Data on Component Mount
  const fetchData = useCallback(async () => {
    try {
      const [taskRes, examRes, studentRes] = await Promise.all([
        axios.get("https://care-x7rk.onrender.com/api/tasks"),
        axios.get("https://care-x7rk.onrender.com/api/exams"),
        axios.get("https://care-x7rk.onrender.com/api/students"),
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

  const handleSubmit = async (e, data, url, setter, successMessage, type) => {
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

  const handleEdit = (item, type) => {
    if (type === "task") setEditingTask(item);
    else if (type === "student") setEditingStudent(item);
    else if (type === "exam") setEditingExam(item);
  };

  const handleUpdate = async (e, type) => {
    e.preventDefault();
    try {
      let url, data;
      if (type === "task") {
        url = `https://care-x7rk.onrender.com/api/tasks/${editingTask._id}`;
        data = editingTask;
      } else if (type === "student") {
        url = `https://care-x7rk.onrender.com/api/students/${editingStudent._id}`;
        data = editingStudent;
      } else if (type === "exam") {
        url = `https://care-x7rk.onrender.com/api/exams/${editingExam._id}`;
        data = editingExam;
      }
      await axios.put(url, data);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      if (type === "task") setEditingTask(null);
      else if (type === "student") setEditingStudent(null);
      else if (type === "exam") setEditingExam(null);
      fetchData();
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update.");
    }
  };

  const toggleSection = (type, setState) => {
    setState(prev => {
      const newState = { student: false, task: false, exam: false };
      newState[type] = !prev[type];
      return newState;
    });
  };

  // Function to download students' details as an Excel sheet
  const downloadStudentsAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "StudentsList.xlsx");
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/",{ replace: true });
    window.location.reload();
  };

  

  return (
    <div className="dashboard-container">
      <nav 
  className="navbar" 
  style={{ 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "10px 20px", 
    backgroundColor: "#f8f9fa"
  }}
>
  <h2 style={{ display: "flex", alignItems: "center", gap: "700px", flexWrap: "nowrap" }}>
    Teacher Dashboard
    <button 
      onClick={handleLogout} 
      style={{ 
        backgroundColor: "#ff4d4d", 
        color: "white", 
        border: "none", 
        padding: "10px 15px", 
        fontSize: "16px", 
        cursor: "pointer", 
        borderRadius: "5px", 
        transition: "background-color 0.3s ease",
        whiteSpace: "nowrap"
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = "#cc0000"}
      onMouseOut={(e) => e.target.style.backgroundColor = "#ff4d4d"}
    >
      Logout
    </button>
  </h2>
</nav>

      <div className="sections-container">
        <div className="form-sections">
          {[ 
            { type: "student", title: "Add New Student", fields: newStudent, setFields: setNewStudent,
                             url: "https://care-x7rk.onrender.com/api/students/add", successMessage: "Student added successfully!" },
            { type: "task", title: "Assign a Task", fields: newTask, setFields: setNewTask,
                             url: "https://care-x7rk.onrender.com/api/tasks/assign", successMessage: "Task assigned successfully!" },
            { type: "exam", title: "Exams", fields: newExam, setFields: setNewExam,
                             url: "https://care-x7rk.onrender.com/api/exams/create", successMessage: "Exam created successfully!" }
          ].map(({ type, title, fields, setFields, url, successMessage }) => (
            <div key={type} className="form-section">
              <h3 onClick={() => toggleSection(type, setShowForms)} style={{ cursor: "pointer" }}>
                {title} {showForms[type] ? "▲" : "▼"}
              </h3>
              {showForms[type] && (
                <form onSubmit={(e) => handleSubmit(e, fields, url, setFields, successMessage, type)}>
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
        </div>

        <div className="list-sections">
          {[ 
            { type: "student", title: "Students List", data: students, url: "https://care-x7rk.onrender.com/api/students", itemFormat: item => `${item.name} - ${item.course} - Batch: ${item.batch} - Roll No: ${item.rollNo}` },
            { type: "task", title: "Assigned Tasks List", data: tasks, url: "https://care-x7rk.onrender.com/api/tasks", itemFormat: item => `${item.title} - Due: ${item.dueDate}` },
            { type: "exam", title: "Scheduled Exams List", data: exams, url: "https://care-x7rk.onrender.com/api/exams", itemFormat: item => `${item.subject} - ${new Date(item.date).toLocaleDateString()} - ${item.duration} hours` }
          ].map(({ type, title, data, url, itemFormat }) => (
            <div key={type} className="list-section">
              <h3 onClick={() => toggleSection(type, setShowLists)} style={{ cursor: "pointer" }}>
                {title} {showLists[type] ? "▲" : "▼"}
              </h3>
              
              {showLists[type] && (
                <ul>
                  {data.map(item => (
                    <li key={item._id}>
                      {itemFormat(item)}
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(item, type)}>Edit ✍</button>
                        <button className="delete-btn" onClick={() => handleDelete(item._id, url, `${title.split(" ")[0]} deleted successfully!`)}>Delete 🗑</button>
                      </div>
                    </li>
                  ))}
                  {/* Show Download button only for Students List */}
          {type === "student" && (
            <button onClick={downloadStudentsAsExcel} className="download-btn">
              <b>Download</b>
            </button>
          )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

    
      {/* Edit Modals */}
      {editingTask && (
        <div className="edit-modal">
          <h3>Edit Task</h3>
          <form onSubmit={(e) => handleUpdate(e, "task")}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              required
            />
            <input
              type="date"
              name="dueDate"
              placeholder="Due Date"
              value={editingTask.dueDate}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
              required
            />
            <button type="submit">Update Task</button>
            <button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
          </form>
        </div>
      )}

      {editingStudent && (
        <div className="edit-modal">
          <h3>Edit Student</h3>
          <form onSubmit={(e) => handleUpdate(e, "student")}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editingStudent.name}
              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={editingStudent.email}
              onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={editingStudent.mobile}
              onChange={(e) => setEditingStudent({ ...editingStudent, mobile: e.target.value })}
              required
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={editingStudent.course}
              onChange={(e) => setEditingStudent({ ...editingStudent, course: e.target.value })}
              required
            />
             <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={editingStudent.duration}
              onChange={(e) => setEditingStudent({ ...editingStudent,duration: e.target.value })}
              required
            />
            <button type="submit">Update Student</button>
            <button type="button" onClick={() => setEditingStudent(null)}>Cancel</button>
          </form>
        </div>
      )}

      {editingExam && (
        <div className="edit-modal">
          <h3>Edit Exam</h3>
          <form onSubmit={(e) => handleUpdate(e, "exam")}>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={editingExam.subject}
              onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })}
              required
            />
            <input
              type="date"
              name="date"
              placeholder="Date"
              value={editingExam.date}
              onChange={(e) => setEditingExam({ ...editingExam, date: e.target.value })}
              required
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={editingExam.duration}
              onChange={(e) => setEditingExam({ ...editingExam, duration: e.target.value })}
              required
            />
            <button type="submit">Update Exam</button>
            <button type="button" onClick={() => setEditingExam(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;