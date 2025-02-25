import React, { useEffect, useState, useCallback } from "react";
import api from '../../api';
import "../../assets/css/Developer/Connect.css";
import { FaLinkedin, FaGithub, FaGlobe, FaUserCircle } from "react-icons/fa";  // Social icons
import Header from "../../components/Header"

const Connect = () => {
  const [developers, setDevelopers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);  // Tracks the currently visible developer
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loggedInDeveloperId = localStorage.getItem("developerId");
  console.log("Logged-in Developer ID:", loggedInDeveloperId);  

  // Fetch developer cards on component mount
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await api.get("/api/developer/connect", {
          headers: { 
            "developer-id": loggedInDeveloperId
          }
        });
        console.log("Fetched Developers:", response.data);
        setDevelopers(response.data);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError("Failed to fetch developers. Please try again later.");
      }
    };

    fetchDevelopers();
  }, [loggedInDeveloperId]);

  // Function to handle swipe actions
  const handleSwipe = useCallback(async (direction) => {
    if (developers.length === 0) return;

    const swipedDeveloperId = developers[currentIndex]?.id;
    const action = direction === "right" ? "swipeRight" : "swipeLeft";

    console.log("Swiping on Developer ID:", swipedDeveloperId, "Direction:", direction);
    try {
      const response = await api.post("/api/developer/connect", {
        developerId : swipedDeveloperId,
        action,
      }, {
        headers: {
          "developer-id": loggedInDeveloperId, 
          "Content-Type": "application/json",
        },
      });
      console.log("Swipe Response:", response.data);
      setMessage(`You swiped ${direction} on ${developers[currentIndex].fullName}`);
      setTimeout(() => setMessage(""), 2000);  // Clear the message after 2 seconds

      // Move to the next developer
      setCurrentIndex((prevIndex) => prevIndex + 1);

    } catch (err) {
      console.error("Swipe Error:", err.response?.data || err.message);
      setError("Error recording swipe action. Please try again.");
    }
  }, [developers, currentIndex, loggedInDeveloperId]);

  // Listen for arrow key presses to trigger swipes
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") handleSwipe("right");
      if (event.key === "ArrowLeft") handleSwipe("left");
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);  // Cleanup event listener
  }, [handleSwipe]);

  return (
    <div>
      <Header />
  
      <div className="connect-container">
        {message && <div className="info-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
  
        {developers.length > 0 && currentIndex < developers.length ? (

          <div>
          {/* 🔹 Swipe Buttons (Moved Inside `swipe-card`, Below Content) */}
          <div className="swipe-buttons-container">
            <button className="swipe-btn-connect swipe-left" onClick={() => handleSwipe("left")}>
              ← Swipe Left (Reject)
            </button>
            <button className="swipe-btn-connect swipe-right" onClick={() => handleSwipe("right")}>
              Swipe Right (Connect) →
            </button>
          </div>
          <span className="swipe-hint">Use Arrow Keys to swipe</span>


          <div className="swipe-card">
            {/* 🔹 Left Column: Profile + Professional Details + Education */}
            <div className="left-column">
              {/* Profile Header */}
              {developers[currentIndex]?.profilePhoto ? (
                <img 
                  src={`https://talent-bridge-rho.vercel.app${developers[currentIndex].profilePhoto}`} 
                  alt="Profile" 
                  className="profile-photo-connect" 
                />
              ) : (
                <FaUserCircle className="default-profile-icon-connect" />
              )}
              <div className="basic-info">
                <h3>{developers[currentIndex].fullName}</h3>
                <p className="location">{developers[currentIndex].location || "Location not provided"}</p>
                <p className="bio-connect">{developers[currentIndex].bio || "No bio provided"}</p>
              </div>
  
              {/* Social Links */}
              <div className="social-links-connect">
                {developers[currentIndex].linkedIn && (
                  <a href={developers[currentIndex].linkedIn} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                )}
                {developers[currentIndex].github && (
                  <a href={developers[currentIndex].github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                )}
                {developers[currentIndex].portfolio && (
                  <a href={developers[currentIndex].portfolio} target="_blank" rel="noopener noreferrer">
                    <FaGlobe />
                  </a>
                )}
              </div>
  
              {/* Professional Details */}
              {developers[currentIndex].professionalDetails && (
                <div className="section">
                  <h4>Professional Details</h4>
                  <p><strong>Current Job:</strong> {developers[currentIndex].professionalDetails.currentJob} at {developers[currentIndex].professionalDetails.company || "N/A"}</p>
                  <p><strong>Skills:</strong> {developers[currentIndex].professionalDetails.skills?.join(", ") || "N/A"}</p>
                  <p><strong>Experience:</strong> {developers[currentIndex].professionalDetails.yearsOfExperience} years</p>
                </div>
              )}
  
              {/* Education */}
              {developers[currentIndex].education && developers[currentIndex].education.length > 0 && (
                <div className="section">
                  <h4>Education</h4>
                  {developers[currentIndex].education.map((edu, idx) => (
                    <p key={idx}>
                      {edu.degree} from {edu.college} ({edu.graduationYear})
                    </p>
                  ))}
                </div>
              )}
            </div>
  
            {/* 🔹 Right Column: Work Experience + Additional Info */}
            <div className="right-column">
              {/* Work Experience */}
              {developers[currentIndex].workExperience && developers[currentIndex].workExperience.length > 0 && (
                <div className="section">
                  <h4>Work Experience</h4>
                  {developers[currentIndex].workExperience.map((work, idx) => (
                    <div key={idx} className="work-experience-item">
                      <p><strong>{work.jobTitle}</strong> at {work.company} ({work.startDate} - {work.endDate || "Present"})</p>
                      <ul>
                        {work.responsibilities.map((task, taskIdx) => (
                          <li key={taskIdx}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
  
              {/* Additional Info */}
              {developers[currentIndex].additionalInfo && (
                <div className="section">
                  <h4>Additional Information</h4>
                  <p><strong>Certifications:</strong> {developers[currentIndex].additionalInfo.certifications?.join(", ") || "N/A"}</p>
                  <p><strong>Achievements:</strong> {developers[currentIndex].additionalInfo.achievements?.join(", ") || "N/A"}</p>
                  <p><strong>Languages:</strong> {developers[currentIndex].additionalInfo.languages?.join(", ") || "N/A"}</p>
                </div>
              )}
            </div>

          </div>

          </div>

        ) : (
          <p>No more developers to show.</p>
        )}
      </div>
    </div>
  );
  
};

export default Connect;
