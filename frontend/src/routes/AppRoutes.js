import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import DeveloperDashboard from "../pages/Developer/Dashboard";
import CompanyDashboard from "../pages/Company/Dashboard";

import Connect from "../pages/Developer/Connect";
import Apply from "../pages/Developer/Apply";
import Connections from "../pages/Developer/Connections";
import Applications from "../pages/Developer/Applications";
import Profile from "../pages/Developer/Profile";
import Settings from "../pages/Developer/Settings";

import JobApplications from "../pages/Company/Applicants";
import CompanySettings from "../pages/Company/Settings";

const AppRoutes = () => {
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        
        <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />

        <Route path="/developer/connect" element={<Connect />} />
        <Route path="/developer/apply" element={<Apply />} />
        <Route path="/developer/connections" element={<Connections />} />
        <Route path="/developer/applications" element={<Applications />} />
        <Route path="/developer/profile" element={<Profile />} />
        <Route path="/developer/settings" element={<Settings />} />
        <Route path="/company/job/:jobId/applications" element={<JobApplications />} />
        
        <Route path="/company/settings" element={<CompanySettings/>} />


      </Routes>

  );
};

export default AppRoutes;
