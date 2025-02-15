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
      console.log("Sending Login Request:", { email, password, role });

      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password, role });
      console.log("Full Response:", response.data);

      if (response.data.success) {
        alert("Login Successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", role);
        
        // Redirect based on user role
        navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
      } else {
        console.warn("Login Failed:", response.data.message);
        alert(response.data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="fade-in">Login as {role === "teacher" ? "Teacher" : "Student"}</h2>
        <select className="role-select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
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
