import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../api';
import "../assets/css/Auth.css";

const Login = () => {

  //Initialize useNavigate Hook
  const navigate = useNavigate();

  const [role, setRole] = useState("developer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState('');  // success, error, or info

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showForgotPasswordSection, setShowForgotPasswordSection] = useState(false);  // To toggle forgot password section

  const handleLogin = async () => {
    setEmailError(false);
    setPasswordError(false);

    if(!email && !password){
      setEmailError(true);
      setPasswordError(true);
      setMessage("Please enter your email and password.");
      setMessageType('error');
      fadeOut();
      return;
    }
    if (!email) {
      setEmailError(true);
      setMessage("Please enter your email.");
      setMessageType('error');
      fadeOut();
      return;
    }

    if (!password){
      setPasswordError(true);
      setMessage("Please enter your password.");
      setMessageType('error');
      fadeOut();
      return;
    }

    try {
        let response;
        if (role === "developer"){
          response = await api.post("/api/auth/developer/login", {
            email,
            password,
          });
          localStorage.setItem("developerId", response.data.developerId); // Store JWT token in local storage
        }
        else if (role === "company") {
          response  = await api.post("/api/auth/company/login", {
            email,
            password,
          });
          localStorage.setItem("companyId", response.data.companyId); // Store JWT token in local storage
        }
        setMessage(response.data.message);
        setMessageType('success');
        fadeOut();

        

        //redirect to dashboard page (useNavigate Hook from react-router-dom)
  
        setTimeout(() => {
          if (role === "developer") {
            navigate("/developer/dashboard"); 
          } else {
            navigate("/company/dashboard"); 
          }
        }, 1000); //Delay
    }catch(error){
      console.log("Login Error:", error.response?.data?.message);
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
      setMessageType('error');
      fadeOut();
    }
  };


  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      setMessageType('error');
      fadeOut();
      return;
    }

    try {
      const response = await api.post("/api/auth/forgot-password", {
        email,
        type: role,
      });

      setMessage(response.data.message);  // Show success message
      setMessageType('success');
      triggerMessageFadeOut();

    } catch (error) {
      console.log("Error status:", error.response?.status);
      console.log("Error message:", error.response?.data?.message);

      if (error.response?.status === 404 && error.response?.data?.message === "User not found") {
        setMessage("The email you entered doesn't exist in the database.");
        setMessageType('error');
        fadeOut();
      } else {
        setMessage(error.response?.data?.message || "Failed to send reset link.");
        triggerMessageFadeOut();
        setMessageType('error');
      }
    }
  };

  const triggerMessageFadeOut = () => {
    setShowMessage(true);  // Show the message

    setTimeout(() => {
      setShowMessage(false);  // Start fading out

      // After fade-out, show additional info message
      setTimeout(() => {
        setMessage("Didn't receive the email? Click on 'Send Reset Link' again.");
        setMessageType('info');
        setShowMessage(true);  // Show the new message
      }, 900);  // Wait for fade-out to complete
    }, 7000);  // Show the original message for 5 seconds
  };


  const fadeOut = () => {
    setShowMessage(true);  // Show the message
    
    // Hide the message after 7 seconds (7000 ms)
    setTimeout(() => {
      setShowMessage(false); 
    }, 7000);
  };

  useEffect(() => {
    fadeOut(); // Trigger fade out when the component mounts
  }, []);

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <div className="role-toggle">
        <button onClick={() => setRole("developer")} className={role === "developer" ? "active" : ""}>
          Developer
        </button>
        <button onClick={() => setRole("company")} className={role === "company" ? "active" : ""}>
          Company
        </button>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={emailError ? "input-error" : ""}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={passwordError ? "input-error" : ""}
        required
      />
      <button onClick={handleLogin}>Login</button>

      {/* Success/Error/Info Messages */}
      {showMessage && (
        <div className={`message-container ${messageType}`}>
          {message}
        </div>
      )}

      {/* Forgot Password Link */}
      <p>
        <span
          className="forgot-password-link"
          onClick={() => setShowForgotPasswordSection(!showForgotPasswordSection)}
        >
          Forgot Password?
        </span>
      </p>

      {/* Forgot Password Section */}
      {showForgotPasswordSection && (
        <div className="forgot-password-section">
          <h3>Reset Your Password</h3>

          {/* Send Reset Link Button */}
          <button onClick={handleForgotPassword}>Send Reset Link</button>
        </div>
      )}

      {/* Toggle for new users */}
      <p>
        First time here? <Link to="/signup">Register Now</Link>
      </p>
    </div>
  );
};

export default Login;
