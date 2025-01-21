import React from "react";
import "../../assets/css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>Platform</h3>
        <p>Features</p>
        <p>HelpDesk</p>
      </div>
      <div className="footer-section">
        <h3>Resources</h3>
        <p>Blog</p>
        <p>Best Practices</p>
        <p>Support</p>
      </div>
      <div className="footer-section">
        <h3>Follow Us</h3>
        <p>Instagram</p>
        <p>LinkedIn</p>
      </div>
    </footer>
  );
};

export default Footer;
