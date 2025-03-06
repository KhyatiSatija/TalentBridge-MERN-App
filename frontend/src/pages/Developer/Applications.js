import React, {useEffect, useState, useCallback, useRef} from "react";
import axios from "axios";
import "../../tailwind.css"; 
import "../../assets/css/Developer/Applications.css";
import { FaEllipsisV, FaTrashAlt, FaRedo, FaBookmark, FaTimes  } from "react-icons/fa";
import Header from "../../components/Header";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("applied");
    const loggedInDeveloperId = localStorage.getItem("developerId");
    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);


    const fetchApplications = useCallback(async () => {
        try{
            const response = await axios.get('http://localhost:5000/api/developer/applications',{
                headers : {
                    "developer-id" : loggedInDeveloperId
                },
            });
            switch(activeTab) {
                case "rejected":
                    setApplications(response.data.rejectedApplications.map((job) => ({
                        ...job,
                        jobId: job.jobId || job._id,  // ✅ Ensure jobId is set
                    })));
                    break;
                case "bookmarked":
                    setApplications(response.data.onHoldApplications.map((job) => ({
                        ...job,
                        jobId: job.jobId || job._id,  // ✅ Ensure jobId is set
                    })));
                    break;
                case "applied":
                    setApplications([
                        ...response.data.appliedApplications.map((job) => ({
                            ...job,
                            jobId: job.jobId || job._id, 
                            status: "Applied",
                        })),
                        ...response.data.underProcessApplications.map((job) => ({
                            ...job,
                            jobId: job.jobId || job._id, 
                            status: "Under Process",
                        })),
                        ...response.data.hiredApplications.map((job) => ({
                            ...job,
                            jobId: job.jobId || job._id, 
                            status: "Hired",
                        })),
                    ]);
                    break;
                default:
                    setApplications([]);
            }
        }
        catch(err){
            setError(err.response?.data?.message || "Error fetching Job Applications");
            console.error("Error fetching applications:", err);
        }
    }, [activeTab, loggedInDeveloperId]);

    useEffect( () => {

        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 2500); 
    
            return () => clearTimeout(timer); // Cleanup on unmount
        }

        fetchApplications();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
        
    }, [activeTab, fetchApplications, error]);

    const updateStatus = async (jobId, action) => {
        try{
            console.log("job ID", jobId);
            const response = await axios.put('http://localhost:5000/api/developer/applications', {
                jobId,
                action
             },
             {
                headers: {
                    "developer-id" : loggedInDeveloperId
                },
            });
            console.log(response.data?.message);
            setApplications((prevApplications) =>
                prevApplications.filter((job) => {
                    if (action === "reject" && activeTab === "bookmarked") {
                        return job.jobId !== jobId; // Remove rejected job from bookmarked list
                    }
                    return true; // Keep other jobs
                })
            );
            fetchApplications(); //Refresh UI After Update
        }
        catch(error){
            setError(error.response?.data?.message || "Error in updating the job application");

            console.error("Error updating application:", error);
        }
    };

    return(
        <div>
            <div>
                <Header/>
            </div>

            <div className="w-full mx-auto p-6">
                {/* Header Tabs */}
                <div className="flex justify-between w-full max-w-4xl mx-auto border-b pb-2">
                        <button
                            className={`tab-button ${activeTab === "rejected" ? "active" : ""}`}
                            onClick={ () => setActiveTab("rejected")}
                        >
                            Jobs Rejected
                        </button>
                        <button
                            className={`tab-button ${activeTab === "bookmarked" ? "active" : ""}`}
                            onClick={() => setActiveTab("bookmarked")}
                        >
                          Jobs Bookmarked
                        </button>
                        <button
                          className={`tab-button ${activeTab === "applied" ? "active" : ""}`}
                          onClick={() => setActiveTab("applied")}
                        >
                          Jobs Applied
                        </button>   

                </div>
                {error && (
                        <div className="error-message-">
                            {error}
                        </div>
                )}

                {/* Table */}
                <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">

                    <table className="w-full text-sm text-left text-gray-600">
                        <thead  className="bg-gray-100 border-b whitespace-nowrap">
                            <tr>
                                <th className="px-6 py-3 whitespace-nowrap">Job Title</th>
                                <th className="px-6 py-3 whitespace-nowrap">Description</th>
                                <th className="px-6 py-3 whitespace-nowrap">Responsibilities</th>
                                <th className="px-6 py-3 whitespace-nowrap">Required Skills</th>
                                <th className="px-6 py-3 whitespace-nowrap">Salary</th>
                                <th className="px-6 py-3 whitespace-nowrap">Work Mode</th>
                                <th className="px-6 py-3 whitespace-nowrap">Location</th>
                                <th className="px-6 py-3 whitespace-nowrap">Deadline</th>
                                {activeTab === "applied" && <th className="px-6 py-3 whitespace-nowrap">Status</th>}
                                <th className="px-6 py-3 whitespace-nowrap"></th>                            
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((job) => (
                                <tr key={job.jobId} className="border-b hover:bg-gray-50 relative">
                                    <td className="px-6 py-4">{job.jobTitle}</td>
                                    <td className="px-6 py-4">{job.jobDescription}</td>
                                    <td className="px-6 py-4">{job.responsibilities.join(", ")}</td>
                                    <td className="px-6 py-4">{job.requiredSkills.join(", ")}</td>
                                    <td className="px-6 py-4">{job.salaryRange}</td>
                                    <td className="px-6 py-4">{job.workMode}</td>
                                    <td className="px-6 py-4">{job.location}</td>
                                    <td className="px-6 py-4">{new Date(job.lastDateToApply).toLocaleDateString()}</td>
                                    {activeTab === "applied" && <td className="px-6 py-4">{job.status}</td>}

                                    {/* Actions Dropdown */}
                                    {/* Actions Dropdown */}
                                    <td className="px-6 py-4 text-right relative">
                                        <div className="relative inline-block dropdown-container">
                                            {/* Show dropdown only if the job is NOT hired */}
                                            {job.status !== "Hired" && (
                                                <>
                                                    {/* Three Dots Menu */}
                                                    <FaEllipsisV
                                                        className="dropdown-icon"
                                                        size={18}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdown(openDropdown === job.jobId ? null : job.jobId);
                                                        }}
                                                    />
                                    
                                                    {/* Dropdown Menu */}
                                                    {openDropdown === job.jobId && (
                                                        <select
                                                            className="dropdown-select"
                                                            onChange={(e) => {
                                                                const action = e.target.value;
                                                                if (action) {
                                                                    console.log("Job ID and action are ",job.jobId, action);
                                                                    updateStatus(job.jobId, action); 
                                                                    setOpenDropdown(null);
                                                                }
                                                                e.target.value = ""; // Reset dropdown to default
                                                            }}
                                                            defaultValue=""
                                                        >
                                                            <option value="" hidden>Select Action</option>
                                                        
                                                            {activeTab === "rejected" && (
                                                                <>
                                                                    <option value="delete">🗑 Delete</option>
                                                                    <option value="apply">🔄 Re-Apply</option>
                                                                </>
                                                            )}
                                    
                                                            {activeTab === "bookmarked" && (
                                                                <>
                                                                    <option value="reject">❌ Reject</option>
                                                                    <option value="delete">🗑 Delete</option>
                                                                    <option value="apply">🔖 Apply</option>
                                                                </>
                                                            )}
                                    
                                                            {activeTab === "applied" && job.status !== "Hired" && (
                                                                <option value="reject">❌ Withdraw Application</option>
                                                            )}
                                                        </select>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                
                                
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>

    );
};

export default Applications;