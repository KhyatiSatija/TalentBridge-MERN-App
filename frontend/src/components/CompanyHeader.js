import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaCog } from "react-icons/fa"; 
import companyLogo from "../assets/images/companyLogo.png";
import "../assets/css/Company/Header.css"; 

const CompanyHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo-section" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <img src={companyLogo} alt="Company Logo" className="logo" />
        <h1 className="company-name">TalentBridge</h1>
      </div>

      <nav className="navigation">
        <button onClick={() => navigate("/company/dashboard")} className="nav-item">
          <FaBriefcase className="icon" />
          <span>Jobs</span>
        </button>

        <button onClick={() => navigate("/company/settings")} className="nav-item">
          <FaCog className="icon" />
          <span>Settings</span>
        </button>
      </nav>
    </header>
  );
};

export default CompanyHeader;
