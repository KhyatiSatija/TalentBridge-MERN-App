import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../assets/css/Developer/Connect.css";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";  // Social icons
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
        const response = await axios.get("http://localhost:5000/api/developer/connect", {
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
      const response = await axios.post("http://localhost:5000/api/developer/connect", {
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
        <div>
      <Header />
    </div>
    <div className="connect-container">

      {message && <div className="info-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {developers.length > 0 && currentIndex < developers.length ? (
        <div className="swipe-card">
          {/* Profile Header */}
          <div className="profile-header">
            <img
              src={developers[currentIndex].profilePhoto || "https://www.pngall.com/wp-content/uploads/15/Animated-Face-PNG-HD-Image.png"} //default image
              alt={developers[currentIndex].fullName}
              className="profile-photo"
            />
            <div className="basic-info">
              <h3>{developers[currentIndex].fullName}</h3>
              <p className="location">{developers[currentIndex].location}</p>
              <p className="bio">{developers[currentIndex].bio || "No bio Provided"}</p>
            </div>
          </div>
        
          {/* Social Links */}
          <div className="social-links">
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
              <p><strong>Current Job:</strong> {developers[currentIndex].professionalDetails.currentJob} at {developers[currentIndex].professionalDetails.company}</p>
              <p><strong>Looking For:</strong> {developers[currentIndex].professionalDetails.lookingFor}</p>
              <p><strong>Skills:</strong> {developers[currentIndex].professionalDetails.skills.join(", ")}</p>
              <p><strong>Experience:</strong> {developers[currentIndex].professionalDetails.yearsOfExperience} years</p>
            </div>
          )}
        
          {/* Education */}
          {developers[currentIndex].education && (
            <div className="section">
              <h4>Education</h4>
              <p>{developers[currentIndex].education.degree} from {developers[currentIndex].education.college} ({developers[currentIndex].education.graduationYear})</p>
            </div>
          )}
        
          {/* Work Experience */}
          {developers[currentIndex].workExperience && developers[currentIndex].workExperience.length > 0 && (
            <div className="section">
              <h4>Work Experience</h4>
              {developers[currentIndex].workExperience.map((work, idx) => (
                <div key={idx} className="work-experience-item">
                  <p><strong>{work.jobTitle}</strong> at {work.companyName} ({work.duration})</p>
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
        
          {/* Swipe Instructions */}
          <div className="swipe-instructions">
            <button className="swipe-btn swipe-left">← Swipe Left (Reject)</button>
            <button className="swipe-btn swipe-right">Swipe Right (Connect) →</button>
          </div>
          <span className="swipe-hint">Use Arrow Keys to swipe</span>
        </div>
        
      ) : (
        <p>No more developers to show.</p>
      )}
    </div>
    </div>
    
  );
};

export default Connect;
