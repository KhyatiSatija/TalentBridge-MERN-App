import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Talent Bridge</div>
      <ul className="nav-links">
        <li><Link to="#features">Features</Link></li>
        <li><Link to="#about-us">About Us</Link></li>
      </ul>
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