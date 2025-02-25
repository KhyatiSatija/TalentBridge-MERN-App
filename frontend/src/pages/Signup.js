import React, { useState } from "react";
import "../assets/css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import api from './api';

const Signup = () => {
    //Initialize the useNavigate Hook
    const navigate = useNavigate();

    const [role, setRole] = useState("developer"); // Default to developer
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    });

    const [message, setMessage] = useState(""); // Message to display
    const [messageType, setMessageType] = useState(""); // success or error
    const [showMessage, setShowMessage] = useState(false); // Control message visibility
  
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    
         // Validate form fields
    const validateForm = () => {
          let errors = [];
        
          if (!formData.fullName) {
            errors.push(role === "developer" ? "Full name is required." : "Company name is required.");
          }
          if (!formData.email) {
            errors.push("Email is required.");
          }
          if (!formData.password) {
            errors.push("Password is required.");
          }
          if (role === "developer" && !formData.phoneNumber) {
            errors.push("Phone number is required.");
          }
        
          if (errors.length > 0) {
            // Join all errors into a single string separated by line breaks
            setMessage(errors.join(" ")); 
            setMessageType("error");
            setShowMessage(true);
            return false;
          }
        
          return true;
        };
        

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; // Stop submission if validation fails

    const apiUrl =
      role === "developer"
        ? "/api/auth/developer/signup"
        : "/api/auth/company/signup";

    //request
    const payload =
      role === "developer"
        ? formData
        : { name: formData.fullName, email: formData.email, password: formData.password };

    try {
      const response = await api.post(apiUrl, payload);

      //store response.data.developerId and response.data.companyId in local storage
      if (role === "developer") {
        localStorage.setItem("developerId", response.data.developerId);
      } else {
        localStorage.setItem("companyId", response.data.companyId); 
      }
      
      setMessage(response.data.message); // Display success message
      setMessageType("success");
      setShowMessage(true);

      //redirect to dashboard page (useNavigate Hook from react-router-dom)
  
      setTimeout(() => {
        if (role === "developer") {
          navigate("/developer/dashboard"); 
        } else {
          navigate("/company/dashboard"); 
        }
      }, 1000); //Delay


    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed!");
      setMessageType("error");
      setShowMessage(true);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <div className="role-toggle">
        <button onClick={() => setRole("developer")} className={role === "developer" ? "active" : ""}>
          Developer
        </button>
        <button onClick={() => setRole("company")} className={role === "company" ? "active" : ""}>
          Company
        </button>
      </div>

            
      {showMessage && (
        <div className={`message-container ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
      <input
          type="text"
          name="fullName"
          placeholder={role === "developer" ? "Full Name" : "Company Name"}
          value={formData.fullName}
          onChange={handleChange}
        
        />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}  />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange}  />

        {role === "developer" && (
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
           
          />
        )}
        
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Go to Login Page
        </Link>
      </p>
    </div>
  );
};

export default Signup;
