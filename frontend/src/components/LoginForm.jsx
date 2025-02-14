import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Import the updated CSS file

const LoginForm = () => {
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/login", { email, password, role });

      if (data.success) {
        navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
      } else {
        alert("Invalid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="fade-in">Login as {role === "teacher" ? "Teacher" : "Student"}</h2>
        <select className="role-select" onChange={(e) => setRole(e.target.value)}>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>EmpID</label>
          </div>
          <div className="input-container">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Password</label>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
