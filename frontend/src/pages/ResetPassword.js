import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/css/ResetPassword.css";

const ResetPassword = () => {
  const { resetToken } = useParams();  // Get reset token from the URL
  const [role, setRole] = useState("developer");  // Default role is developer
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        type: role,
      });

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      <div className="role-toggle">
        <button onClick={() => setRole("developer")} className={role === "developer" ? "active" : ""}>
          Developer
        </button>
        <button onClick={() => setRole("company")} className={role === "company" ? "active" : ""}>
          Company
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
