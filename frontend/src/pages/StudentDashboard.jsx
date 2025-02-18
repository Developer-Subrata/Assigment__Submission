import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./TeacherDashboard.css";

const StudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  
  const [showSections, setShowSections] = useState({ student: false, task: false, exam: false });

  // Fetch Data on Component Mount
  const fetchData = useCallback(async () => {
    try {
      const [studentRes, taskRes, examRes] = await Promise.all([
        axios.get("http://localhost:5000/api/students"),
        axios.get("http://localhost:5000/api/tasks"),
        axios.get("http://localhost:5000/api/exams"),
      ]);
      setStudents(studentRes.data);
      setTasks(taskRes.data);
      setExams(examRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSection = (type) => {
    setShowSections(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      
      {/* Student List */}
      <div className="list-section">
        <h3 onClick={() => toggleSection("student")} style={{ cursor: "pointer" }}>
          Students List {showSections.student ? "▲" : "▼"}
        </h3>
        {showSections.student && (
          <ul>
            {students.map(student => (
              <li key={student._id}>
                {student.name} - {student.course} - Batch: {student.batch} - Roll No: {student.rollNo}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Task List */}
      <div className="list-section">
        <h3 onClick={() => toggleSection("task")} style={{ cursor: "pointer" }}>
          Assigned Tasks {showSections.task ? "▲" : "▼"}
        </h3>
        {showSections.task && (
          <ul>
            {tasks.map(task => (
              <li key={task._id}>
                {task.title} - Due: {task.dueDate}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Exam List */}
      <div className="list-section">
        <h3 onClick={() => toggleSection("exam")} style={{ cursor: "pointer" }}>
          Scheduled Exams {showSections.exam ? "▲" : "▼"}
        </h3>
        {showSections.exam && (
          <ul>
            {exams.map(exam => (
              <li key={exam._id}>
                {exam.subject} - {new Date(exam.date).toLocaleDateString()} - {exam.duration} hours
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
