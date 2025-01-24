const JobDescriptions = require('../../models/jobDescriptions');
const CompanyJobApplications = require('../../models/companyJobApplications');
const DeveloperApplications = require('../../models/developerApplications');

// @desc Create a new job
// @route POST /api/company/jobs/create
const createJob = async (req, res) => {
  const { jobTitle, jobDescription, responsibilities, requiredSkills, salaryRange, workMode, location, lastDateToApply } = req.body;

  try {
    const job = await JobDescriptions.create({
      companyId: req.user.id,
      jobTitle,
      jobDescription,
      responsibilities,
      requiredSkills,
      salaryRange,
      workMode,
      location,
      lastDateToApply,
    });

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
    const jobs = await JobDescriptions.find({ companyId: req.user.id });
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
    const job = await JobDescriptions.findByIdAndDelete(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Delete corresponding job application record
    await CompanyJobApplications.findOneAndDelete({ jobId });

    // Delete all developer applications for this job
    await DeveloperApplications.deleteMany({ jobId });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

// @desc Get applications for a job
// @route GET /api/company/jobs/:jobId/applications
const getJobApplications = async (req, res) => {
  const { jobId } = req.params;

  try {
    const applications = await CompanyJobApplications.findOne({ jobId }).populate({
      path: 'jobApplications',
      populate: { path: 'rejected applied underProcess hired', select: '-password' },
    });

    if (!applications) return res.status(404).json({ message: 'Applications not found for this job' });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

module.exports = { createJob, getAllJobs, editJob, deleteJob, getJobApplications };
