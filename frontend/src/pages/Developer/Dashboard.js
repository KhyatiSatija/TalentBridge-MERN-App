import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUsers, FaBriefcase, FaLink, FaFileAlt, FaUser, FaCog } from "react-icons/fa";  // Importing icons
import "../../assets/css/Developer/Dashboard.css";  // Importing CSS for styling

const DeveloperDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [techNews, setTechNews] = useState([]);
  const [error, setError] = useState("");

  // Fetch tech news on component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/developer/dashboard");
        setTechNews(response.data.techNews);
      } catch (err) {
        setError("Failed to load tech news. Please try again later.");
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header Navigation */}
      <nav className="dashboard-nav">
        <button onClick={() => navigate("/developer/connect")}><FaUsers /> Connect with Developers</button>
        <button onClick={() => navigate("/developer/apply")}><FaBriefcase /> Apply to Jobs</button>
        <button onClick={() => navigate("/developer/connections")}><FaLink /> My Connections</button>
        <button onClick={() => navigate("/developer/applications")}><FaFileAlt /> My Applications</button>
        <button onClick={() => navigate("/developer/profile")}><FaUser /> My Profile</button>
        <button onClick={() => navigate("/developer/settings")}><FaCog /> Settings</button>
      </nav>

      {/* Main Section: Display Tech News */}
      <main className="dashboard-main">
        <h2>Latest Tech News</h2>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="news-list">
            {techNews.length > 0 ? (
              techNews.map((newsItem, index) => (
                <div className="news-card" key={index}>
                  {newsItem.urlToImage && (
                    <img src={newsItem.urlToImage} alt={newsItem.title} className="news-image" />
                  )}
                  <div className="news-content">
                    <h3><a href={newsItem.url} target="_blank" rel="noopener noreferrer">{newsItem.title}</a></h3>
                    <p>{newsItem.description || "No description available."}</p>
                    <div className="news-meta">
                      <span>{newsItem.source}</span> | <span>{new Date(newsItem.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading news...Hang In There </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeveloperDashboard;
