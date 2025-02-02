import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../assets/css/Auth.css";

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("developer");

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
        type: role,
      });
      alert(response.data.message); // Show success message
      setShowForgotPassword(false); // Close the modal after successful submission
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {/* Login form fields */}
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button>Login</button>

      {/* Forgot Password Link */}
      <p>
        <span className="forgot-password-link" onClick={() => setShowForgotPassword(true)}>
          Forgot Password?
        </span>
      </p>

      {/* Toggle for new users */}
      <p>
        First time here? <Link to="/signup">Register Now</Link>
      </p>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h3>Reset Password</h3>

            {/* Role Toggle */}
            <div className="role-toggle">
              <button onClick={() => setRole("developer")} className={role === "developer" ? "active" : ""}>
                Developer
              </button>
              <button onClick={() => setRole("company")} className={role === "company" ? "active" : ""}>
                Company
              </button>
            </div>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Action Buttons */}
            <button onClick={handleForgotPassword}>Send Reset Link</button>
            <button onClick={() => setShowForgotPassword(false)} className="close-modal-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
