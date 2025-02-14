import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaLinkedin, FaGithub, FaExternalLinkAlt, FaSpinner } from "react-icons/fa";
import "../../assets/css/Company/Applicants.css";
  
import * as XLSX from "xlsx";

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState({
    applied: [],
    underProcess: [],
    hired: [],
    rejected: [],
  });
  const [filteredApplications, setFilteredApplications] = useState({
    applied: [],
    underProcess: [],
    hired: [],
    rejected: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/company/jobs/${jobId}/applications`);
        const { rejected, applied, underProcess, hired } = response.data.data.jobApplications;
  
        // Ensure there are no duplicate records
        const newApplications = {
          rejected: [...new Map(rejected.map(item => [item._id, item])).values()],
          applied: [...new Map(applied.map(item => [item._id, item])).values()],
          underProcess: [...new Map(underProcess.map(item => [item._id, item])).values()],
          hired: [...new Map(hired.map(item => [item._id, item])).values()]
        };
  
        setApplications(newApplications);
        setFilteredApplications(newApplications);
      } catch (error) {
        setError("Failed to load applications. Try again later.");
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchApplications();
  }, [jobId]);
  

  const handleStatusChange = async (developerId, newStatus) => {
    try {
      // Define API endpoints based on status transition
      const apiEndpoints = {
        applied: {
          underProcess: "http://localhost:5000/api/company/applications/process",
          rejected: "http://localhost:5000/api/company/applications/reject",
        },
        underProcess: {
          hired: "http://localhost:5000/api/company/applications/hire",
          rejected: "http://localhost:5000/api/company/applications/reject-under-process",
        },
        rejected: {
          underProcess: "http://localhost:5000/api/company/applications/move-rejected-to-under-process",
        }
      };
  
      // Determine the correct API based on the current and new status
      // let currentStatus = "";
      // if (applications.applied.some(app => app._id === developerId)) currentStatus = "applied";
      // else if (applications.underProcess.some(app => app._id === developerId)) currentStatus = "underProcess";
      // else if (applications.rejected.some(app => app._id === developerId)) currentStatus = "rejected";
      let currentStatus = Object.keys(applications).find(status =>
        applications[status].some(app => app._id === developerId)
      );
      const apiUrl = apiEndpoints[currentStatus]?.[newStatus];
  
      if (!apiUrl) {
        console.error("Invalid status transition");
        return;
      }
  
      // Make API call
      await axios.put(apiUrl, { jobId, developerId });
  
      // Update frontend state (move applicant to new status category)
      setApplications(prevApplications => {
        const updatedApplications = { ...prevApplications };
  
      // Remove developer from old category
      updatedApplications[currentStatus] = updatedApplications[currentStatus].filter(
        (app) => app._id !== developerId
      );

      // Ensure new category does not contain duplicates
      if (!updatedApplications[newStatus].some(app => app._id === developerId)) {
        updatedApplications[newStatus].push(
          prevApplications[currentStatus].find((app) => app._id === developerId)
        );
      }

  
        return updatedApplications;
      });
      setFilteredApplications((prevFiltered) => ({
        ...prevFiltered,
        [currentStatus]: prevFiltered[currentStatus].filter((app) => app._id !== developerId),
        [newStatus]: prevFiltered[newStatus].some(app => app._id === developerId)
          ? prevFiltered[newStatus] // Do nothing if already present
          : [...prevFiltered[newStatus], applications[currentStatus].find(app => app._id === developerId)]
      }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
  
    if (!applications) return;
  
    const filtered = Object.keys(applications).reduce((acc, status) => {
      acc[status] = (applications[status] || []).filter((applicant) =>
        (applicant.fullName?.toLowerCase() || "").includes(searchValue) ||
        (applicant.skills?.join(" ").toLowerCase() || "").includes(searchValue) ||
        status.toLowerCase().includes(searchValue)
      );
      return acc;
    }, { applied: [], underProcess: [], hired: [], rejected: [] });
  
    setFilteredApplications(filtered);
  };
  

const downloadExcel = () => {
  if (!filteredApplications) return;

  // Convert applications object into a flat array
  const allApplications = ["applied", "underProcess", "hired", "rejected"].flatMap(
    (status) =>
      filteredApplications[status].map((applicant) => ({
        FullName: applicant.fullName,
        Status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
        Experience: `${applicant.yearsOfExperience} yrs`,
        CurrentJob: applicant.currentJob || "N/A",
        Skills: applicant.skills.join(", "),
        Degree: applicant.degree || "N/A",
        GraduationYear: applicant.graduationYear || "N/A",
        LinkedIn: applicant.linkedIn || "N/A",
        GitHub: applicant.github || "N/A",
        Portfolio: applicant.portfolio || "N/A",
      }))
  );

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(allApplications);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");

  // Download the file
  XLSX.writeFile(workbook, "Job_Applications.xlsx");
};


  return (
    <div className="container job-applications-page">
      <h2 className="text-center">Job Applications</h2>

      {loading ? (
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
          Loading applications...
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : applications.length === 0 ? (
        <p className="no-applications">No applications received yet.</p>
      ) : (
      <>
        <input
          type="text"
          placeholder="Search by name, skills, or status..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <button className="download-btn" onClick={downloadExcel}>Download as Excel</button>


        <table className="applications-table">
                <thead>
                  <tr>
                    <th>Candidate</th> 
                    <th>Work Experience</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Education</th>
                    <th>Links</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {["rejected", "applied", "underProcess", "hired"].map((status) =>
                      [...new Map(filteredApplications[status]?.map(app => [app._id, app])).values()].map((applicant)  => (
                    <tr key={applicant._id}>
                      <td>
                        <div className="candidate-info">
                          {applicant.profilePhoto ? (
                            <img src={`http://localhost:5000${applicant.profilePhoto}`} alt="Profile" className="profile-photo" />
                          ) : (
                            <FaUserCircle className="profile-icon" />
                          )}
                          <span>{applicant.fullName}</span>
                        </div>
                      </td>
                      <td>
                          {applicant.currentJob ? (
                            <p>Currently working as {applicant.currentJob}</p>
                          ) : (
                            <p>No current job</p>
                          )}
                          {applicant.workExperience.length > 0
                            ? applicant.workExperience.map((exp, index) => (
                                <p key={index}>{exp.jobTitle} at {exp.company}</p>
                              ))
                            : <p>No past experience</p>
                          }
                      </td>
                      <td>{applicant.yearsOfExperience} yrs</td>
                      <td>{applicant.skills.join(", ")}</td>
                      <td>
                        <div className="education">
                          <p>Degree: {applicant.degree || "Not mentioned"}</p>
                          <p>Graduation Year: {applicant.graduationYear || "Not mentioned"}</p>
                        </div>
                      </td>
                        
                      <td>
                        <div className="link-icons">
                          {applicant.linkedIn && (
                            <a href={applicant.linkedIn} target="_blank" rel="noopener noreferrer">
                              <FaLinkedin />
                            </a>
                          )}
                          {applicant.github && (
                            <a href={applicant.github} target="_blank" rel="noopener noreferrer">
                              <FaGithub />
                            </a>
                          )}
                          {applicant.portfolio && (
                            <a href={applicant.portfolio} target="_blank" rel="noopener noreferrer">
                              <FaExternalLinkAlt />
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                          {status === "hired" ? (
                            <span className="status-hired">Hired</span>
                          ) : (
                            <select
                              className="status-dropdown"
                              value={status}
                              onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                            >
                              <option value="" disabled>Select Status</option>
                              {status === "applied" && (
                                <> 
                                  <option value="applied" disabled>Applied</option>
                                  <option value="underProcess">Under Process</option>
                                  <option value="rejected">Rejected</option>
                                </>
                              )}
                              {status === "underProcess" && (
                                <>
                                  <option value="underProcess" disabled>Under Process </option>
                                  <option value="hired">Hired</option>
                                  <option value="rejected">Rejected</option>
                                </>
                              )}
                              {status === "rejected" && (
                                <>
                                  <option value="rejected" disabled> Rejected</option>
                                  <option value="underProcess">Under Process</option>
                                </>
                              )}
                            </select>
                          )}
                      </td>
                        
                    </tr>
                  ))
                  )}
                </tbody>
          </table>
              </>
      )}
    </div>
  );
};

export default Applicants;
