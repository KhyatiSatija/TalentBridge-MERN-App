const JobDescriptions = require('../../models/jobDescriptions');
const CompanyJobApplications = require('../../models/companyJobApplications');
const DeveloperApplications = require('../../models/developerApplications');
const Developer = require("../../models/developer");
const DeveloperProfile = require("../../models/developerProfile");
const mongoose = require("mongoose");
const Company = require("../../models/company");


// @desc return company Name
// @route GET /api/company/jobs/companyname
const companyName = async (req, res) => {
  try {
    const companyId  = req.headers["company-id"];
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({ message : "Company Not found !"});
    }
    return res.status(200).json({ companyName: company.name });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company name', error: error.message });
  }
};

// @desc Create a new job
// @route POST /api/company/jobs/create
const createJob = async (req, res) => {
  const { jobTitle, jobDescription, responsibilities, salaryRange, workMode, location, lastDateToApply, requiredSkills} = req.body;

  const companyId = req.headers["company-id"];
  console.log(companyId);
  console.log(req.body);
  try {
    if (!companyId) {
      console.log("❌ Invalid companyId:", companyId);
      return res.status(400).json({ message: "Invalid or missing companyId" });
    }
    const lastDate = new Date(lastDateToApply);
    console.log("Converted lastDateToApply:", lastDate);

    if (!Array.isArray(responsibilities) || !Array.isArray(requiredSkills)) {
      console.log("❌ responsibilities or requiredSkills are not arrays");
      return res.status(400).json({ message: "Responsibilities and requiredSkills must be arrays" });
    }
    const job = await JobDescriptions.create({
      companyId: companyId,
      jobTitle :  jobTitle,
      jobDescription : jobDescription,
      responsibilities: responsibilities,
      requiredSkills: requiredSkills,
      salaryRange: salaryRange,
      workMode: workMode,
      location: location,
      lastDateToApply: lastDate,
    });
    console.log(" Job Created:", job);
    
    // Create corresponding job application record
    await CompanyJobApplications.create({ jobId: job._id, jobApplications: { rejected: [], applied: [], underProcess: [], hired: [] } });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
};

// @desc Fetch all jobs posted by the company
// @route GET /api/company/jobs
const getAllJobs = async (req, res) => {
  try {
    const companyId = req.headers['company-id'];
    const jobs = await JobDescriptions.find({ companyId: companyId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// @desc Edit a job posting
// @route PUT /api/company/jobs/:jobId
const editJob = async (req, res) => {
  const { jobId } = req.params;
  const updates = req.body;

  try {
    const job = await JobDescriptions.findByIdAndUpdate(jobId, updates, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
};

// @desc Delete a job posting
// @route DELETE /api/company/jobs/:jobId
const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await JobDescriptions.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await JobDescriptions.findByIdAndDelete(jobId);

    // Delete corresponding job application record
    await CompanyJobApplications.findOneAndDelete({ jobId });

    // Delete all developer applications for this job
    await DeveloperApplications.updateMany(
      {},
      {
        $pull: {
          "applications.rejected" : jobId,
          "applications.applied": jobId,
          "applications.underProcess": jobId,
          "applications.hired": jobId,
          "applications.underHold": jobId,
          "applications.rejectedByCompany": jobId,
        },
      }
    );

    res.status(200).json({ message: 'Job and related applications deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

// @desc Get applications for a job
// @route GET /api/company/jobs/:jobId/applications
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    const applications = await CompanyJobApplications.findOne({ jobId }).lean();

    if (!applications) {
      return res.status(404).json({ message: 'No applications found for this job' });
    }

    const getDeveloperSummary = async (developerId) => {
      const developer = await Developer.findById(developerId).select('fullName').lean();
      const profile = await DeveloperProfile.findOne({ developerId }).select(
        'profilePhoto linkedIn github portfolio professionalDetails.currentJob professionalDetails.yearsOfExperience professionalDetails.skills education workExperience.company workExperience.jobTitle languagesPreferred'
      ).lean();

      if (!developer) return null;

      return {
        _id: developerId,
        fullName: developer.fullName,
        profilePhoto: profile?.profilePhoto || null,
        linkedIn: profile?.linkedIn || null,
        github: profile?.github || null,
        portfolio: profile?.portfolio || null,
        currentJob: profile?.professionalDetails?.currentJob || null,
        yearsOfExperience: profile?.professionalDetails?.yearsOfExperience || 0,
        skills: profile?.professionalDetails?.skills || [],
        education: profile?.education?.map(edu => ({
          college: edu.college || null,
          degree: edu.degree || null,
          graduationYear: edu.graduationYear || null
        })) || [],
        workExperience: profile?.workExperience?.map(exp => ({
          company: exp.company,
          jobTitle: exp.jobTitle,
        })) || [],
        languagesPreferred: profile?.languagesPreferred || []
      };
    };

    const populateDevelopers = async (developerIds) => {
      return Promise.all(developerIds.map(async (id) => {
        const developerSummary = await getDeveloperSummary(id);
        return {
          ...developerSummary,
          degree: developerSummary.education.length > 0 ? developerSummary.education.map(edu => edu.degree).join(", ") : "Not Provided",
          graduationYear: developerSummary.education.length > 0 ? developerSummary.education.map(edu => edu.graduationYear).join(", ") : "Not Provided",
        };
      }));
    };
    

    const rejected = await populateDevelopers(applications.jobApplications.rejected);
    const applied = await populateDevelopers(applications.jobApplications.applied);
    const underProcess = await populateDevelopers(applications.jobApplications.underProcess);
    const hired = await populateDevelopers(applications.jobApplications.hired);

    const result = {
      _id: applications._id,
      jobId: applications.jobId,
      jobApplications: {
        rejected,
        applied,
        underProcess,
        hired
      }
    };

    res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications', error: error.message });
  }
};


// @desc Toggle Accepting Responses by the company
// @route PUT /api/company/jobs/:jobId
const toggleJobApplications = async (req, res) => {
  const { jobId } = req.params;
  const { acceptingApplications } = req.body;

  try {
    const job = await JobDescriptions.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.acceptingApplications = acceptingApplications;
    await job.save();

    res.status(200).json({ message: `Job application status updated to ${acceptingApplications}`, job });
  } catch (error) {
    res.status(500).json({ message: "Error updating job application status", error: error.message });
  }
};

// @desc retrieve job title based on the ID in the URL (req.params)
// @route GET /api/company/jobs/:jobid
const getJobTitle = async (req, res) => {
  const { jobId } = req.params;
  try{
    const job = await JobDescriptions.findById(jobId);
    if (!job){
      return res.status(404).json({ message : "Job Id not found"});
    }
    return res.status(200).json( { jobTitle : job.jobTitle});
  }catch(error) {
    console.log("Not ablet to retrieve jobTitle from the database");
    return res.status(500).json({ message : "Error retrieving jobTitle", error : error.message });
  }
}

module.exports = { createJob, getAllJobs, editJob, deleteJob, getJobApplications, toggleJobApplications, companyName, getJobTitle };
