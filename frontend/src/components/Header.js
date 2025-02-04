
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBriefcase, FaLink, FaFileAlt, FaUser, FaCog } from "react-icons/fa";
import "../assets/css/Header.css";


const Header = () => {
    const navigate = useNavigate();
    return (
          <nav className="dashboard-nav">
                  <button onClick={() => navigate("/developer/connect")}><FaUsers /> Connect with Developers</button>
                  <button onClick={() => navigate("/developer/apply")}><FaBriefcase /> Apply to Jobs</button>
                  <button onClick={() => navigate("/developer/connections")}><FaLink /> My Connections</button>
                  <button onClick={() => navigate("/developer/applications")}><FaFileAlt /> My Applications</button>
                  <button onClick={() => navigate("/developer/profile")}><FaUser /> My Profile</button>
                  <button onClick={() => navigate("/developer/settings")}><FaCog /> Settings</button>
          </nav>
    
    );
};

export default Header;