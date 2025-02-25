import React, { useEffect, useState } from "react";
import api from './api'; 
import "../../assets/css/Developer/Dashboard.css";  // Importing CSS for styling
import Header from "../../components/Header"
const DeveloperDashboard = () => {
  const [techNews, setTechNews] = useState([]);
  const [error, setError] = useState("");

  // Fetch tech news on component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/api/developer/dashboard");
        setTechNews(response.data.techNews);
      } catch (err) {
        setError("Failed to load tech news. Please try again later.");
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="dashboard-container">

      <Header />

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
