import React, { useState } from "react";
import "../assets/css/Auth.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
    const [role, setRole] = useState("developer"); // Default to developer
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
    });
  
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const apiUrl =
          role === "developer"
            ? "http://localhost:5000/api/auth/developer/signup"
            : "http://localhost:5000/api/auth/company/signup";
    
        const payload =
          role === "developer"
            ? formData
            : { name: formData.fullName, email: formData.email, password: formData.password };
    
        try {
          const response = await axios.post(apiUrl, payload);
          alert(response.data.message);
        } catch (error) {
          alert(error.response?.data?.message || "Signup failed!");
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
      <form onSubmit={handleSubmit} className="auth-form">
      <input
          type="text"
          name="fullName"
          placeholder={role === "developer" ? "Full Name" : "Company Name"}
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        {role === "developer" && (
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
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
