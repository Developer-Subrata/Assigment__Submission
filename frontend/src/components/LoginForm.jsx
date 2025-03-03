import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Import your CSS file

const LoginForm = () => {
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending Login Request:", { email, password, role });

      let response;
      if (role === "teacher") {
        response = await axios.post("https://care-x7rk.onrender.com/login", {
          email,
          password,
          role,
        });
      } else {
        response = await axios.post("https://care-x7rk.onrender.com/STDlogin", {
          rollNo: email, // Students use rollNo instead of email
          password,
        });
      }

      console.log("Full Response:", response.data);

      if (response.data.success) {
        alert("Login Successful!");

        // Store user data properly
        localStorage.setItem("user", JSON.stringify({ token: response.data.token, role }));

        // Small delay before navigation to ensure localStorage updates first
        setTimeout(() => {
          navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
        }, 100);
      } else {
        alert(response.data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
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
            <label>UserID</label>
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
