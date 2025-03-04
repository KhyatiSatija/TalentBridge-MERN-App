import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../assets/css/Developer/Connections.css";
import { FaLinkedin, FaGithub, FaGlobe, FaEnvelope, FaPhone, FaCheck, FaTimes, FaUndo, FaUserCircle } from "react-icons/fa";
import Header from "../../components/Header";
import { io } from 'socket.io-client';

// const POLL_INTERVAL = 100000000000000000000000000000000000000000000; // 10 seconds

// Connect to the WebSocket server
const socket = io("http://localhost:5000", {  
  transports: ["websocket"], 
  reconnectionAttempts: 5, // Retry up to 5 times if disconnected
  reconnectionDelay: 3000 // wait for 3 seconds before retrying
});
const Connections = () => {
  const [connections, setConnections] = useState({
    connectionRequests: [],
    requested: [],
    matched: []
  });
  const [activeTab, setActiveTab] = useState('connectionRequests');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch connections on component mount
  useEffect(() => {
    const loggedInDeveloperId = localStorage.getItem("developerId");
    if (loggedInDeveloperId) {
      socket.emit("joinRoom", loggedInDeveloperId); // Join the WebSocket room
    }

    if (!socket.connected) {
      socket.connect();
    }
    fetchConnections();  // Initial fetch when component mounts

    // Polling: Fetch connections every 5 seconds
    // const interval = setInterval(() => {
    //   fetchConnections();
    // }, POLL_INTERVAL);

    // // // Cleanup: Stop polling when the component unmounts
    // return () => clearInterval(interval);

    // // Listen for real-time updates when a connection is accepted
    // socket.on('connection-updated', ({ developerId }) => {
    //   // const loggedInDeveloperId = localStorage.getItem("developerId");
    //   console.log('Real-time update received for', developerId);
    //   if (developerId === loggedInDeveloperId) {
    //     fetchConnections();
    //   }  // Refresh connections when an update is received
    // });

    // // Cleanup on component unmount
    // return () => {
    //   socket.off('connection-updated');
    // };
  }, []);

  // Fetch Developer Connections from API
  const fetchConnections = async () => {
    try {
      const loggedInDeveloperId = localStorage.getItem("developerId");  
      
      const response = await axios.get('http://localhost:5000/api/developer/connections', {
        headers: {
          "developer-id": loggedInDeveloperId
        }
      });

      setConnections(response.data);

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching connections");
      setLoading(false);
    }
  };

  // Handle Connection Actions (Accept, Reject, Cancel)
  const handleConnectionAction = async (targetDeveloperId, action) => {
    try {
      console.log(targetDeveloperId); 

      const loggedInDeveloperId = localStorage.getItem("developerId");

      const response = await axios.put('http://localhost:5000/api/developer/connections', {
        targetDeveloperId,
        action
      }, {
        headers: {
          "developer-id": loggedInDeveloperId
        }
      });
      console.log(response.data.message);

      // Refresh the connection list after action
      fetchConnections();
    } catch (err) {
      console.error('Error updating connection:', err.response?.data?.message || err.message);
    }
  };

  // Render connection cards based on active tab
  const renderConnections = () => {
    console.log(activeTab);
    const currentConnections = connections[activeTab];
    console.log(currentConnections);
  
    if (!currentConnections || currentConnections.length === 0) {
      return <p className="no-connections">No connections in this category.</p>;
    }
  
    return currentConnections.map((dev) => (
      <div key={dev.developerId} className={`connection-card ${activeTab === 'matched' ? 'matched' : ''}`}>
        
        {/* Left Section */}
        <div className="profile-left">
          {dev?.profilePhoto ? (
            <img src={`http://localhost:5000${dev.profilePhoto}`} alt="Profile" className="profile-photo-connections" />
          ) : (
            <FaUserCircle className="default-profile-icon-connections" />
          )}
          <h4>{dev.fullName}</h4>
          <p className="location">{dev.location || "Location not specified"}</p>
  
          {/* Social Links */}
          <div className="social-links">
            {dev.linkedIn && (
              <a href={dev.linkedIn} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            )}
            {dev.github && (
              <a href={dev.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            )}
            {dev.portfolio && (
              <a href={dev.portfolio} target="_blank" rel="noopener noreferrer"><FaGlobe /></a>
            )}
          </div>
  
          {/* Education */}
          {dev.education && dev.education.length > 0 && (
            <div className="education">
              <p><strong>Education:</strong></p>
              {dev.education.map((edu, idx) => (
                <p key={idx}>{edu.degree} from {edu.college} ({edu.graduationYear})</p>
              ))}
            </div>
          )}
        </div>
  
        {/* Right Section */}
        <div className="profile-right">
          <p className="bio">{dev.bio || "No bio provided"}</p>
          
          <div className="section">
            <strong>Current Job:</strong>
            <p>{dev.professionalDetails?.currentJob || "N/A"}</p>
          </div>
  
          {/* Work Experience */}
          {dev.workExperience && dev.workExperience.length > 0 && (
            <div className="work-experience">
              <strong>Work Experience:</strong>
              {dev.workExperience.map((exp, idx) => (
                <p key={idx}>{exp.jobTitle} at {exp.company} ({new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'})</p>
              ))}
            </div>
          )}
  
          {/* Skills */}
          <div className="skills">
            <strong>Skills:</strong>
            <p>{dev.professionalDetails?.skills?.join(", ") || "N/A"}</p>
          </div>
  
          {/* Certifications */}
          {dev.certifications && dev.certifications.length > 0 && (
            <div className="certifications">
              <strong>Certifications:</strong>
              {dev.certifications.map((cert, idx) => (
                <p key={idx}>{cert}</p>
              ))}
            </div>
          )}
  
          {/* Achievements */}
          {dev.achievements && dev.achievements.length > 0 && (
            <div className="achievements">
              <strong>Achievements:</strong>
              {dev.achievements.map((ach, idx) => (
                <p key={idx}>{ach}</p>
              ))}
            </div>
          )}
  
          {/* Languages */}
          {dev.languages && dev.languages.length > 0 && (
            <div className="languages">
              <strong>Languages:</strong>
              {dev.languages.map((lang, idx) => (
                <p key={idx}>{lang}</p>
              ))}
            </div>
          )}
        </div>
  
        {/* Contact Info for Matched Developers */}
        {activeTab === 'matched' && (
          <div className="contact-info">
            <div className="contact-info-row">
              <p><FaEnvelope /> {dev.email}</p>
            </div>
            <div className="contact-info-row">
              <p><FaPhone /> {dev.phoneNumber}</p>
            </div>
          </div>
        )}
  
        {/* Action Buttons */}
        <div className="action-buttons">
          {activeTab === 'connectionRequests' && (
            <>
              <button onClick={() => handleConnectionAction(dev.developerId, 'accept')} className="accept-btn">
                <FaCheck /> Accept
              </button>
              <button onClick={() => handleConnectionAction(dev.developerId, 'reject')} className="reject-btn">
                <FaTimes /> Reject
              </button>
            </>
          )}
          {activeTab === 'requested' && (
            <button onClick={() => handleConnectionAction(dev.developerId, 'cancelRequest')} className="cancel-btn">
              <FaUndo /> Cancel Request
            </button>
          )}
        </div>
      </div>
    ));
  };
  

  if (loading) return <div className="loading-message"> <Header/> Loading connections...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div>
        <Header />
      </div>
  
      <div className="connections-container">
        <div className="connections-tabs">
          <button
            className={activeTab === 'connectionRequests' ? 'active-tab' : ''}
            onClick={() => setActiveTab('connectionRequests')}
          >
            Connection Requests
          </button>
          <button
            className={activeTab === 'requested' ? 'active-tab' : ''}
            onClick={() => setActiveTab('requested')}
          >
            Requested
          </button>
          <button
            className={activeTab === 'matched' ? 'active-tab' : ''}
            onClick={() => setActiveTab('matched')}
          >
            Matched Developers
          </button>
        </div>
  
        {/* Display corresponding connections */}
        <div className="connections-list">
          {renderConnections()}
        </div>
      </div>
    </div>
  );
  
};

export default Connections;
