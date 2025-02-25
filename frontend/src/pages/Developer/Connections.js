import React, { useEffect, useState } from 'react';
import api from '../../api';
import "../../assets/css/Developer/Connections.css";
import { FaLinkedin, FaGithub, FaGlobe, FaEnvelope, FaPhone, FaCheck, FaTimes, FaUndo, FaUserCircle } from "react-icons/fa";
import Header from "../../components/Header"
import { io } from 'socket.io-client';

// const POLL_INTERVAL = 100000000000000000000000000000000000000000000; // 10 seconds

// Connect to the WebSocket server
const socket = io("https://talent-bridge-rho.vercel.app", {  
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
      
      const response = await api.get('/api/developer/connections', {
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

      const response = await api.put('/api/developer/connections', {
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
        {dev?.profilePhoto ? (
          <img 
            src={`https://talent-bridge-rho.vercel.app${dev.profilePhoto}`} 
            alt="Profile" 
            className="profile-photo-connections" 
          />
        ) : (
          <FaUserCircle className="default-profile-icon-connections" />
        )}
        <h4>{dev.fullName}</h4>
        <p className="bio">{dev.bio || "No bio provided"}</p>

        <div className="location">{dev.location || "Location not specified"}</div>

        {/* Professional Details */}
        <div className="professional-details"> 
          <p><strong>Current Job:</strong> {dev.professionalDetails?.currentJob || "N/A"}</p>
          <p><strong>Skills:</strong> {dev.professionalDetails?.skills?.join(", ") || "N/A"}</p>
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

        {/* Work Experience */}
        {dev.workExperience && dev.workExperience.length > 0 && (
          <div className="work-experience">
            <p><strong>Work Experience:</strong></p>
            {dev.workExperience.map((exp, idx) => (
              <div key={idx}>
                <p>{exp.jobTitle} at {exp.company}</p>
                <p><em>{new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}</em></p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {dev.certifications && dev.certifications.length > 0 && (
          <div className="certifications">
            <p><strong>Certifications:</strong></p>
            {dev.certifications.map((cert, idx) => (
              <p key={idx}>{cert}</p>
            ))}
          </div>
        )}

        {/* Achievements */}
        {dev.achievements && dev.achievements.length > 0 && (
          <div className="achievements">
            <p><strong>Achievements:</strong></p>
            {dev.achievements.map((ach, idx) => (
              <p key={idx}>{ach}</p>
            ))}
          </div>
        )}

        {/* Languages */}
        {dev.languages && dev.languages.length > 0 && (
          <div className="languages">
            <p><strong>Languages:</strong></p>
            {dev.languages.map((lang, idx) => (
              <p key={idx}>{lang}</p>
            ))}
          </div>
        )}

        
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
        
        {/* Contact Info for Matched Developers */}
        {activeTab === 'matched' && (
          <div className="contact-info">
            <p><FaEnvelope /> {dev.email}</p>
            <p><FaPhone /> {dev.phoneNumber}</p>
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
          className={activeTab === 'connectionRequests' ? 'active' : ''} 
          onClick={() => setActiveTab('connectionRequests')}
        >
          Connection Requests
        </button>
        <button 
          className={activeTab === 'requested' ? 'active' : ''} 
          onClick={() => setActiveTab('requested')}
        >
          Requested
        </button>
        <button 
          className={activeTab === 'matched' ? 'active' : ''} 
          onClick={() => setActiveTab('matched')}
        >
          Matched Developers
        </button>
      </div>

      {/* Display corresponding connections */}
      <div className="connections-section">
        {renderConnections()}
      </div>
    </div>
    </div>
    
  );
};

export default Connections;
