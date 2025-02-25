import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from '../api';
import "../assets/css/ResetPassword.css";

const ResetPassword = () => {
  const { resetToken } = useParams();  // Get reset token from the URL
  const [role, setRole] = useState("developer");  // Default role is developer
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");  // Message text
  const [messageType, setMessageType] = useState("");  // success or error
  const [showMessage, setShowMessage] = useState(false);  // Control message visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      setShowMessage(true);
      return;
    }

    try {
      const response = await api.post("/api/auth/reset-password", {
        resetToken,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        type: role,
      });

      // Display success message from the API
      setMessage(response.data.message);
      setMessageType("success");
      setShowMessage(true);

    } catch (error) {
      // Display error message from the API
      setMessage(error.response?.data?.message || "Password reset failed!");
      setMessageType("error");
      setShowMessage(true);
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
      {/* Display Success/Error Messages */}
      {showMessage && (
        <div className={`message-container ${messageType}`}>
          {message}
        </div>
      )}
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

      <p className="login-link">
        Now you can  <Link to="/login">Login </Link> successfully with the new password
      </p>
    </div> 
  );
};

export default ResetPassword;
