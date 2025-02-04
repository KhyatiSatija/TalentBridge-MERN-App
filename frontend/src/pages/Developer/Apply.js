import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../assets/css/Developer/Apply.css";
import { FaBookmark, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Header from "../../components/Header"

const Apply = () => {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const developerId = localStorage.getItem("developerId");

  useEffect(() => {
    const fetchJobs = async () => {
      const developerId = localStorage.getItem("developerId");
      try {
        const response = await axios.get("http://localhost:5000/api/developer/jobs", {
          headers: { "developer-id": developerId }
        });
        console.log(response.data);
        setJobs(response.data);

      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
      }
    };

    fetchJobs();
  }, [developerId]);

  const handleSwipe = useCallback(async (action) => {
    if (jobs.length === 0) return;

    const jobId = jobs[currentIndex]._id; //confirm if _id is present

    try {
      const response = await axios.post("http://localhost:5000/api/developer/jobs", {
        jobId,
        action,
      }, {
        headers: { "developer-id": developerId, "Content-Type": "application/json" },
      });
      console.log(response.data);

      setMessage(`You ${action === 'swipeRight' ? 'applied to' : 'rejected'} the job role of ${jobs[currentIndex].jobTitle}`);
      setTimeout(() => setMessage(""), 2000);
      setCurrentIndex((prevIndex) => prevIndex + 1);

    } catch (err) {
      setError("Error recording swipe action. Please try again.");
    }
  }, [jobs, currentIndex, developerId]);

  const handleBookmark = async () => {
    if (jobs.length === 0) return;

    const jobId = jobs[currentIndex]._id;

    try {
      await axios.post("http://localhost:5000/api/developer/jobs", {
        jobId,
        action: "underHold",
      }, {
        headers: { "developer-id": developerId, "Content-Type": "application/json" },
      });

      setMessage(`You marked ${jobs[currentIndex].jobTitle} as Under Hold`);
      setTimeout(() => setMessage(""), 2000);
      setCurrentIndex((prevIndex) => prevIndex + 1);

    } catch (err) {
      setError("Error marking job as under hold. Please try again.");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") handleSwipe("swipeRight");
      if (event.key === "ArrowLeft") handleSwipe("swipeLeft");
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleSwipe]);

  return (
    <div>
        <div>
      <Header />
    </div>
    
    <div className="apply-container">
      <h2>Apply to Jobs</h2>

      {message && <div className="info-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {jobs.length > 0 && currentIndex < jobs.length ? (
        <div className="job-card">
          <h3>{jobs[currentIndex].jobTitle}</h3>
          <p className="job-description">{jobs[currentIndex].jobDescription}</p>

          <div className="job-details">
            <p><strong>Responsibilities:</strong></p>
            <ul>
              {jobs[currentIndex].responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>

            <p><strong>Required Skills:</strong> {jobs[currentIndex].requiredSkills.join(", ")}</p>
            <p><strong>Salary:</strong> {jobs[currentIndex].salaryRange}</p>
            <p><strong>Work Mode:</strong> {jobs[currentIndex].workMode}</p>
            <p><strong>Location:</strong> {jobs[currentIndex].location}</p>
            <p><strong>Last Date to Apply:</strong> {new Date(jobs[currentIndex].lastDateToApply).toLocaleDateString()}</p>
          </div>

          <div className="swipe-instructions">
            <button className="swipe-btn swipe-left" onClick={() => handleSwipe("swipeLeft")}><FaTimesCircle /> Reject</button>
            <button className="bookmark-btn" onClick={handleBookmark}><FaBookmark /></button>
            <button className="swipe-btn swipe-right" onClick={() => handleSwipe("swipeRight")}><FaCheckCircle /> Apply</button>
          </div>

          <span className="swipe-hint">Use Arrow Keys to swipe</span>
        </div>
      ) : (
        <p>No more jobs to show.</p>
      )}
    </div>
    </div>
    
  );
};

export default Apply;
