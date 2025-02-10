import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "../../assets/css/Company/Dashboard.css";

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    jobTitle: "",
    jobDescription: "",
    responsibilities: "",
    salaryRange: "",
    workMode: "Remote",
    location: "",
    lastDateToApply: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const companyId = localStorage.getItem("companyId");


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/company/jobs", {
          headers: { "company-id" : companyId},
        });
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("/api/company/jobs", {
        headers: { companyId },
      });
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

    // Handle modal input change
    const handleInputChange = (e) => {
        setNewJob({ ...newJob, [e.target.name]: e.target.value });
    };
    
    // Submit new job
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);  
      const formattedJob = {
        ...newJob,
        responsibilities: newJob.responsibilities.split(",").map(item => item.trim()), // Convert to array
        requiredSkills: newJob.requiredSkills.split(",").map(item => item.trim()), // Convert to array
      };
      try {
        console.log(formattedJob);
        console.log(companyId);
        const response = await axios.post("http://localhost:5000/api/company/jobs/create", formattedJob, {
          headers: { "company-id" : companyId }, //express treats headers as case insensitive
        });
        setJobs([...jobs, response.data.job]); // Update UI
        setShowModal(false);
        setNewJob({
          jobTitle: "",
          jobDescription: "",
          responsibilities: "",
          requiredSkills: "",
          salaryRange: "",
          workMode: "Remote",
          location: "",
          lastDateToApply: "",
        });
      } catch (error) {
        console.error("Error creating job:", error);
      }
      setSubmitting(false);
    };
    
  // Delete a job posting
  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/company/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job._id !== jobId)); // Remove from UI
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="container mt-5 company-dashboard">
      <h2 className="text-center dashboard-title">Company Dashboard</h2>

      {/* Post Job Button */}
      <div className="text-center my-3">
        <button className="post-job-btn" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Post a New Job
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : jobs.length === 0 ? (
        // No Jobs Message
        <div className="no-jobs-message">
          Start by posting a job to find the best talent for your needs.
        </div>
      ) : (
        // Job Listings
        <div className="row">
          {jobs.map((job) => (
            <div className="col-md-6 mb-4" key={job._id}>
              <div className="job-card">
                <h5 className="job-title">{job.jobTitle}</h5>
                <p className="job-description">{job.jobDescription}</p>
                <p><strong>Responsibilities:</strong> {job.responsibilities.join(", ")}</p>
                <p><strong>Required Skills:</strong> {job.requiredSkills.join(", ")}</p>
                <p><strong>Salary Range:</strong> {job.salaryRange || "Not disclosed"}</p>
                <p><strong>Work Mode:</strong> {job.workMode || "Not Defined "}</p>
                <p><strong>Location:</strong> {job.location || "None"}</p>
                <p><strong>Last Date to Apply:</strong> {new Date(job.lastDateToApply).toLocaleDateString()}</p>

                <div className="job-actions">
                  <button className="edit-btn" onClick={() => alert(`Edit ${job._id}`)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteJob(job._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Create Job Modal */}
        {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h4>Create New Job</h4>
                <form onSubmit={handleSubmit}>
                  <input type="text" name="jobTitle" placeholder="Job Title" value={newJob.jobTitle} onChange={handleInputChange} required />
                  <textarea name="jobDescription" placeholder="Job Description" value={newJob.jobDescription} onChange={handleInputChange} required />
                  <input type="text" name="responsibilities" placeholder="Responsibilities (comma-separated)" value={newJob.responsibilities} onChange={handleInputChange} required />
                  <input type="text" name="requiredSkills" placeholder="Required Skills (comma-separated)" value={newJob.requiredSkills} onChange={handleInputChange} required />
                  <input type="text" name="salaryRange" placeholder="Salary Range" value={newJob.salaryRange} onChange={handleInputChange} />
                  <select name="workMode" value={newJob.workMode} onChange={handleInputChange} required>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <input type="text" name="location" placeholder="Location" value={newJob.location} onChange={handleInputChange} />
                  <div className="lastDate">
                    <label htmlFor="lastDateToApply"> Last date to apply: </label>
                    <input type="date" name="lastDateToApply" value={newJob.lastDateToApply} onChange={handleInputChange} required />
                  </div>


                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? "Submitting..." : "Create Job"}
                  </button>
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                </form>
              </div>
            </div>
         )}

    </div>
  );
};

export default CompanyDashboard;
