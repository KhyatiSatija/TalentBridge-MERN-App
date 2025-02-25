import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHouseUser, FaUsers, FaBriefcase, FaLink, FaFileAlt, FaCog, FaUserCircle } from "react-icons/fa";
import "../assets/css/Header.css";
import api from '../api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const developerId = localStorage.getItem("developerId"); 
  const [profile, setProfile] = useState(null);

  // Fetch developer profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!developerId) return;
      try {
        const response = await api.get("/api/developer/profile", {
          headers: { "developer-id": developerId },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [developerId]);

  return (
    <nav className="dashboard-nav">
      <button 
        onClick={() => navigate("/developer/dashboard")}
        className={location.pathname === "/developer/dashboard" ? "active" : ""}
      > 
        <FaHouseUser /> My Dashboard
      </button>

      <button 
        onClick={() => navigate("/developer/connect")}
        className={location.pathname === "/developer/connect" ? "active" : ""}
      >
        <FaUsers /> Connect with Developers
      </button>

      <button 
        onClick={() => navigate("/developer/apply")}
        className={location.pathname === "/developer/apply" ? "active" : ""}
      >
        <FaBriefcase /> Apply to Jobs
      </button>

      <button 
        onClick={() => navigate("/developer/connections")}
        className={location.pathname === "/developer/connections" ? "active" : ""}
      >
        <FaLink /> My Connections
      </button>

      <button 
        onClick={() => navigate("/developer/applications")}
        className={location.pathname === "/developer/applications" ? "active" : ""}
      >
        <FaFileAlt /> My Applications
      </button>

      <button 
        onClick={() => navigate("/developer/settings")}
        className={location.pathname === "/developer/settings" ? "active" : ""}
      >
        <FaCog /> Settings
      </button>

      {/* Profile Button with Fallback for Profile Picture and Name */}
      <button 
        onClick={() => navigate("/developer/profile")}
        className={location.pathname === "/developer/profile" ? "active" : ""}
      >
        {profile?.profilePhoto ? (
          <img 
            src={`http://localhost:5000/${profile.profilePhoto}`} 
            alt="Profile" 
            className="profile-photo-header" 
          />
        ) : (
          <FaUserCircle className="default-profile-icon" />
        )}
        {(profile?.fullName) || "My  Profile"}
      </button>
    </nav>
  );
};

export default Header;
