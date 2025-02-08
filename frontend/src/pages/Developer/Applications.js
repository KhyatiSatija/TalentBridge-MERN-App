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
                    setApplications(response.data.rejectedApplications);
                    break;
                case "bookmarked":
                    setApplications(response.data.onHoldApplications);
                    break;
                case "applied":
                    setApplications([
                        ...response.data.appliedApplications.map((job) => ({
                            ...job,
                            status: "Applied",
                        })),
                        ...response.data.underProcessApplications.map((job) => ({
                            ...job,
                            status: "Under Process",
                        })),
                        ...response.data.hiredApplications.map((job) => ({
                            ...job,
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
        fetchApplications();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
              setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
        
    }, [activeTab, fetchApplications]);

    const updateStatus = async (jobId, action) => {
        try{
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
                            className={`text-center px-4 py-2 font-medium ${activeTab === "rejected" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                            onClick={ () => setActiveTab("rejected")}
                        >
                            Jobs Rejected
                        </button>
                        <button
                            className={`text-center px-4 py-2 font-medium ${activeTab === "bookmarked" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                            onClick={() => setActiveTab("bookmarked")}
                        >
                          Jobs Bookmarked
                        </button>
                        <button
                          className={`text-center px-4 py-2 font-medium ${activeTab === "applied" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                          onClick={() => setActiveTab("applied")}
                        >
                          Jobs Applied
                        </button>   

                </div>

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
                                    <td className="px-6 py-4 text-right relative" ref={dropdownRef}>
                                        {/* Dropdown Container */}
                                        <div className="relative inline-block">
                                            <button 
                                                className="text-gray-500 hover:text-gray-700"
                                                onClick={() => setOpenDropdown(openDropdown === job.jobId ? null : job.jobId)}
                                            >
                                                <FaEllipsisV size={18} />
                                            </button>
                                            {/* Dropdown Menu */}

                                            {openDropdown === job.jobId && (
                                                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40 p-2 z-50">
                                                    {activeTab === "rejected" && (
                                                        <>
                                                            <button
                                                                className="dropdown-menu flex items-center px-3 py-2 text-sm text-red-500 hover:bg-gray-100 w-full"
                                                                onClick={() => updateStatus(job.jobId, "delete")}
                                                            >
                                                                <FaTrashAlt className="mr-2" /> Delete
                                                            </button>
                                                            <button
                                                                className="dropdown-menu flex items-center px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 w-full"
                                                                onClick={ () => updateStatus(job.jobId, "apply")}
                                                            >
                                                                <FaRedo className="mr-2"/> Re-Apply
                                                            </button>
                                                        </>
                                                    )}
                                                    {activeTab === "bookmarked" && (
                                                        <>
                                                            <button
                                                                className="dropdown-menu flex items-center px-3 py-2 text-sm text-red-500 hover:bg-gray-100 w-full"
                                                                onClick={ () => updateStatus(job.jobId, "reject")}
                                                            >
                                                                <FaTimes className="mr-2" /> Reject
                                                            </button>
                                                            <button
                                                                className="dropdown-menu flex items-center px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 w-full"
                                                                onClick={() => updateStatus(job.jobId, "delete")}
                                                            >
                                                                <FaTrashAlt className="mr-2" /> Delete
                                                            </button>
                                                            <button
                                                                className="dropdown-menu flex items-center px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 w-full"
                                                                onClick={() => updateStatus(job.jobId, "apply")}
                                                            >
                                                              <FaBookmark className="mr-2" /> Apply
                                                            </button>
                                                        </>
                                                    )}
                                                    {activeTab === "applied" && (
                                                        <button
                                                            className="dropdown-menu flex items-center px-3 py-2 text-sm text-red-500 hover:bg-gray-100 w-full"
                                                            onClick={ () => updateStatus(job.jobId, "reject")}
                                                        >
                                                            <FaTimes className="mr-2" /> Withdraw Application
                                                        </button>
                                                    )}
                                                </div>
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