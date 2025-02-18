import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/Navbar.css";
import companyLogo from "../../assets/images/companyLogo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo and Text */}
      <div className="logo-container">
        <img src={companyLogo} alt="Company Logo" className="logo" />
        <p className="logo-text">Talent Bridge</p>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li><Link to="#features">Features</Link></li>
        <li><Link to="#about-us">About Us</Link></li>
      </ul>

      {/* Authentication Buttons */}
      <div className="auth-buttons">
        <Link to="/signup">
          <button className="register-btn">Register</button>
        </Link>
        <Link to="/login">
          <button className="login-btn">Log In</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
