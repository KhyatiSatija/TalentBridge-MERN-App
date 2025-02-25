import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaLinkedin, FaGithub, FaExternalLinkAlt, FaSpinner, FaSearch,FaFileExcel,  FaEye } from "react-icons/fa";
import "../../assets/css/Company/Applicants.css";
import  CompanyHeader from "../../components/CompanyHeader";
import * as XLSX from "xlsx";
import api from '../../api';
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

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState(null);


  //runs once the component mounts and the jobId changes
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get(`/api/company/jobs/${jobId}/applications`);
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
    const getJobTitle  = async () => {
      try{
        const response = await api.get(`/api/company/jobs/${jobId}`);
        setJobTitle(response.data.jobTitle);
      }catch(error) {
        setError("Failed to load job title");
        console.error("Error loading job title", error);
      }
    };
    getJobTitle();
  
    fetchApplications();
  }, [jobId]);
  

  const handleStatusChange = async (developerId, newStatus) => {
    try {
      // Define API endpoints based on status transition
      const apiEndpoints = {
        applied: {
          underProcess: "/api/company/applications/process",
          rejected: "/api/company/applications/reject",
        },
        underProcess: {
          hired: "/api/company/applications/hire",
          rejected: "/api/company/applications/reject-under-process",
        },
        rejected: {
          underProcess: "/api/company/applications/move-rejected-to-under-process",
        }
      };
  
      // Determine the correct API based on the current and new status
      let currentStatus = Object.keys(applications).find(status =>
        applications[status].some(app => app._id === developerId)
      );
      const apiUrl = apiEndpoints[currentStatus]?.[newStatus];
  
      if (!apiUrl) {
        console.error("Invalid status transition");
        return;
      }
  
      // Make API call
      await api.put(apiUrl, { jobId, developerId });
  
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
    const searchValue = e.target.value.trim().toLowerCase();
    setSearchTerm(searchValue);
  
    if (!applications) return;

    if(!searchValue){
      setFilteredApplications(applications);
      return;
    }
  
    const filtered = Object.keys(applications).reduce((acc, status) => {
      acc[status] = (applications[status] || []).filter((applicant) =>
        (applicant.fullName?.toLowerCase() || "").includes(searchValue) ||
        (applicant.skills?.join(" ").toLowerCase() || "").includes(searchValue) ||
        status.toLowerCase().includes(searchValue) ||
        (applicant.currentJob?.toLowerCase() || "").includes(searchValue) ||
        (applicant.workExperience?.some(exp =>
        (exp.jobTitle?.toLowerCase() || "").includes(searchValue) ||
        (exp.company?.toLowerCase() || "").includes(searchValue) ||
          (applicant.graduationYear?.toString().includes(searchValue) || false)
        ))
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
  XLSX.writeFile(workbook, `Job_Applications_for_${jobTitle}_role_${jobId}.xlsx`);
};


const fetchDeveloperProfile = async (developerId) => {
  try {
    const response = await api.get(`/api/company/applications/developer/${developerId}`, { params: { jobId }});
    setSelectedProfile(response.data);
    setModalOpen(true);
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};



  return (
    <div>
      <CompanyHeader/>
            <div>
          <div className="container job-applications-page">
      <h2 className="text-center">Job Applications for {jobTitle} </h2>

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
        <div  className="search-download-container">
          <div className="search-input">
            <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, skills, job title, education or status..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-bar"
              />
          </div>

            <button className="download-btn" onClick={downloadExcel}>
                <FaFileExcel className="excel-icon" /> Download as Excel
            </button>

        </div>


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
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {["rejected", "applied", "underProcess", "hired"].map((status) =>
                      [...new Map(filteredApplications[status]?.map(app => [app._id, app])).values()].map((applicant)  => (
                    <tr key={applicant._id}>
                      <td>
                        <div className="candidate-info">
                          {applicant.profilePhoto ? (
                            <img src={`https://talent-bridge-rho.vercel.app/api${applicant.profilePhoto}`} alt="Profile" className="profile-photo" />
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
                            {Array.isArray(applicant.education) && applicant.education.length > 0 ? (
                              applicant.education.map((edu, index) => (
                                <p key={index}>
                                  <strong>{edu.degree}</strong> from {edu.college} ({edu.graduationYear})
                                </p>
                              ))
                            ) : (
                              <p>Not Provided</p>
                            )}
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
                                  <option value="rejected">Reject</option>
                                </>
                              )}
                              {status === "underProcess" && (
                                <>
                                  <option value="underProcess" disabled>Under Process </option>
                                  <option value="hired">Hire</option>
                                  <option value="rejected">Reject</option>
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
                      <td>
                          <FaEye
                            className="view-profile-icon"
                            title="View Profile"
                            onClick={() => fetchDeveloperProfile(applicant._id)}
                          />
                      </td>
                        
                    </tr>
                  ))
                  )}
                </tbody>
          </table>
              </>
      )}
    </div>
      {/* modal code */}
      {modalOpen && selectedProfile && (
      <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={() => setModalOpen(false)}>&times;</span>

        {/* Profile Picture & Name */}
        <div className="profile-header">
          {selectedProfile.profilePhoto ? (
            <img src={`https://talent-bridge-rho.vercel.app/api${selectedProfile.profilePhoto}`} alt="Profile" className="modal-profile-photo" />
          ) : (
            <FaUserCircle className="profile-icon" />
          )}
          <h2>{selectedProfile.fullName}</h2>
        </div>
        
        {/* Basic Details */}
        <p><strong>Bio:</strong> {selectedProfile.bio || "No bio available"}</p>
        <p><strong>Location:</strong> {selectedProfile.location || "Not Available"}</p>
        <p><strong>Email:</strong> {selectedProfile.email}</p>
        <p><strong>Phone:</strong> {selectedProfile.phoneNumber}</p>
        
        {/* Professional Details */}
        <h3>Professional Details</h3>
        <p><strong>Current Job:</strong> {selectedProfile.professionalDetails?.currentJob || "Not currently employed"}</p>
        <p><strong>Years of Experience:</strong> {selectedProfile.professionalDetails?.yearsOfExperience || 0} years</p>
        <p><strong>Skills:</strong> {selectedProfile.professionalDetails?.skills?.join(", ") || "No skills listed"}</p>
        <p><strong>Job Roles Interested:</strong> {selectedProfile.professionalDetails?.jobRolesInterested?.join(", ") || "Not specified"}</p>
        
        {/* Social Media & Portfolio Links */}
        <h3>Online Presence</h3>
        <p>
          {selectedProfile.linkedIn && <a href={selectedProfile.linkedIn} target="_blank" rel="noopener noreferrer"> <FaLinkedin />LinkedIn</a>}
        </p>
        <p>
          {selectedProfile.github && <a href={selectedProfile.github} target="_blank" rel="noopener noreferrer"><FaGithub/> Github </a>}
        </p>
        <p>
          {selectedProfile.portfolio && <a href={selectedProfile.portfolio} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt /> Portfolio</a>}
        </p>
        
        {/* Education Details */}
        <h3>Education</h3>
        {selectedProfile.education?.length > 0 ? (
          <ul>
            {selectedProfile.education.map((edu, index) => (
              <li key={index}><strong>{edu.degree}</strong> from {edu.college} ({edu.graduationYear})</li>
            ))}
          </ul>
        ) : (
          <p>No education details provided</p>
        )}

        {/* Work Experience */}
        <h3>Work Experience</h3>
        {selectedProfile.workExperience?.length > 0 ? (
          <ul>
            {selectedProfile.workExperience.map((exp, index) => (
              <li key={index}>
                <strong>{exp.jobTitle}</strong> at {exp.company} ({exp.startDate?.substring(0, 10)} - {exp.endDate?.substring(0, 10)})
                <p><strong>Responsibilities:</strong></p>
                <ul>
                  {exp.responsibilities?.length > 0
                    ? exp.responsibilities.map((resp, idx) => <li key={idx}>{resp}</li>)
                    : <li>No responsibilities listed</li>}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No work experience available</p>
        )}

        {/* Additional Information */}
        <h3>Additional Information</h3>
        <p><strong>Certifications:</strong> {selectedProfile.additionalInfo?.certifications?.join(", ") || "No certifications listed"}</p>
        <p><strong>Achievements:</strong> {selectedProfile.additionalInfo?.achievements?.join(", ") || "No achievements listed"}</p>
        <p><strong>Languages:</strong> {selectedProfile.additionalInfo?.languages?.join(", ") || "No languages listed"}</p>
      
        {/* Preferences */}
        <h3>Preferences</h3>
        <p><strong>Expected Stipend (in LPA): </strong> {selectedProfile.expectedStipend?.join(", ")  || "Not specified"}</p>
        <p><strong>Work Mode:</strong> {selectedProfile.workMode || "Not specified"}</p>
        <p><strong>Preferred Locations:</strong> {selectedProfile.preferredLocations?.join(", ") || "Not specified"}</p>
        <p><strong>Languages Preferred:</strong> {selectedProfile.languagesPreferred?.join(", ") || "Not specified"}</p>
      </div>
</div>
)}


            </div>
    </div>

  );
};

export default Applicants;
