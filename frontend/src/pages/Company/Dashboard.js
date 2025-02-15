import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaEye} from "react-icons/fa";
import "../../assets/css/Company/Dashboard.css";
import { useNavigate  } from "react-router-dom";
import  CompanyHeader from "../../components/CompanyHeader";

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

  const [editJobData, setEditJobData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [jobToDelete,  setJobToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const companyId = localStorage.getItem("companyId");

  const navigate = useNavigate(); 

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
    



  const confirmDeleteJob = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };
    // Delete a job posting
  const deleteJob = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/company/jobs/${jobToDelete._id}`);
      setJobs(jobs.filter((job) => job._id !== jobToDelete._id)); // Remove from UI
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

const editJob = (job) => {
  setEditJobData(job);
  setShowEditModal(true);
};
const handleEditInputChange = (e) => {
  setEditJobData({...editJobData, [e.target.name] : e.target.value});
};

const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(`http://localhost:5000/api/company/jobs/${editJobData._id}`, editJobData);
    setJobs(jobs.map(job => (job._id === editJobData._id ? response.data.job : job)));
    setShowEditModal(false);
  }catch(error){
    console.error("Error updating job: ", error);
  }
};

const toggleJobApplicationStatus = async (jobId, currentStatus) => {
  try {
    const response = await axios.patch(`http://localhost:5000/api/company/jobs/${jobId}`, {
      acceptingApplications: !currentStatus,
    });

    setJobs(jobs.map(job => job._id === jobId ? response.data.job : job));
  } catch (error) {
    console.error("Error updating job status:", error);
  }
};


  return (
    <div>
      <CompanyHeader/>
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
                  <button className="edit-btn" onClick={() => editJob(job)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => confirmDeleteJob(job)}>
                    <FaTrash /> Delete
                  </button>
                  <button 
                    onClick={() => toggleJobApplicationStatus(job._id, job.acceptingApplications)}
                    className={job.acceptingApplications ? "btn btn-success" : "btn btn-secondary"}
                  >
                    {job.acceptingApplications ? "Now Hiring" : "Hiring Paused "}
                  </button>

                  <button 
                    onClick={() => navigate(`/company/job/${job._id}/applications`)} 
                    className="view-applications-btn"
                  >
                    <FaEye /> View Applications
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

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Edit Job</h4>
              <form onSubmit={handleEditSubmit}>
                <input type="text" name="jobTitle" value={editJobData.jobTitle} onChange={handleEditInputChange} required />
                <textarea name="jobDescription" value={editJobData.jobDescription} onChange={handleEditInputChange} required />
                <input type="text" name="responsibilities" value={editJobData.responsibilities.join(", ")} onChange={handleEditInputChange} required />
                <input type="text" name="requiredSkills" value={editJobData.requiredSkills.join(", ")} onChange={handleEditInputChange} required />
                <input type="text" name="salaryRange" value={editJobData.salaryRange} onChange={handleEditInputChange} />
                <select name="workMode" value={editJobData.workMode} onChange={handleEditInputChange} required>
                  <option value="Remote">Remote</option>
                  <option value="Onsite">Onsite</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                <input type="text" name="location" value={editJobData.location} onChange={handleEditInputChange} />
                <label htmlFor="lastDateToApply"> Last date to apply: </label>
                <input type="date" name="lastDateToApply" value={editJobData.lastDateToApply} onChange={handleEditInputChange} required />
        
                <button type="submit" className="submit-btn">Save Changes</button>
                <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4>Confirm Job Deletion</h4>
              <p>
                Deleting this job will permanently remove all applications related to it.
                This action <strong>cannot be undone.</strong> Are you sure?
              </p>
              <div className="modal-actions">
                <button className="delete-confirm-btn" onClick={deleteJob}>
                  Yes, Delete
                </button>
                <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                  No, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
    </div>

  );
};

export default CompanyDashboard;
