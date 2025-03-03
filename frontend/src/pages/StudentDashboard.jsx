import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TeacherDashboard.css";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [completedExams, setCompletedExams] = useState({});


  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/",{ replace: true });
    window.location.reload();
  };
  useEffect(() => {
    const rollNo = "123"; // Replace with dynamic roll number from auth or local storage
  
    axios.get(`http://localhost:5000/api/students/${rollNo}`)
      .then(response => {
        console.log("Student Data:", response.data);
        setStudent(response.data);
      })
      .catch(error => console.error("Error fetching student data:", error));

    // Fetch assignments
    axios.get("http://localhost:5000/api/tasks")
      .then(response => setAssignments(response.data))
      .catch(error => console.error("Error fetching assignments:", error));

    // Fetch exams
    axios.get("http://localhost:5000/api/exams")
      .then(response => setExams(response.data))
      .catch(error => console.error("Error fetching exams:", error));
  }, []);

  // Handle Assignment Submission
  const handleAssignmentSubmit = (id) => {
    console.log("Submitting assignment:", submittedAssignments[id]);
    alert("Assignment Submitted Successfully!");
  };

  // Handle Image Upload
  const handleImageUpload = (event, id) => {
    const file = event.target.files[0];
    console.log("Uploaded file for assignment:", id, file);
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar: Student Info */}
      {student ? (
  <div className="student-card">
    <h3>{student.name || "N/A"}</h3>
    <p><strong>Course:</strong> {student.course || "N/A"}</p>
    <p><strong>Batch:</strong> {student.batch || "N/A"}</p>
    <p><strong>Roll No:</strong> {student.rollNo || "N/A"}</p>
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  </div>
) : (
  <p>Loading Student Info...</p>
)}
      {/* Main Content */}
      <div className="main-content">
        {/* Assignment List */}
        <div className="section">
          <h2>Assignments</h2>
          {assignments.length > 0 ? (
            <ul>
              {assignments.map((assignment) => (
                <li key={assignment._id}>
                  <strong>{assignment.title}</strong> - Due: {assignment.dueDate}
                  <div className="assignment-actions">
                    <textarea
                      placeholder="Write your answer..."
                      onChange={(e) => setSubmittedAssignments({ ...submittedAssignments, [assignment._id]: e.target.value })}
                    ></textarea>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, assignment._id)} />
                    <button onClick={() => handleAssignmentSubmit(assignment._id)}>Submit</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No assignments available.</p>
          )}
        </div>

        {/* Exam List */}
        <div className="section">
          <h2>Exams</h2>
          {exams.length > 0 ? (
            <ul>
              {exams.map((exam) => (
                <li key={exam._id}>
                  <strong>{exam.subject}</strong> - {new Date(exam.date).toLocaleDateString()} - {exam.duration} hours
                  <div className="exam-actions">
                    <label>
                      <input
                        type="checkbox"
                        checked={completedExams[exam._id] || false}
                        onChange={() =>
                          setCompletedExams({ ...completedExams, [exam._id]: !completedExams[exam._id] })
                        }
                      />
                      Completed
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No exams scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
