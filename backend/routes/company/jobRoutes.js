const express = require('express');
const {
  createJob,
  getAllJobs,
  editJob,
  deleteJob,
  getJobApplications,
} = require('../../controllers/company/jobController');
const router = express.Router();

router.post('/create', createJob); // Create a new job - DONE
router.get('/', getAllJobs); // Fetch all jobs by the company - DONE
router.put('/:jobId', editJob); // Edit a job posting
router.delete('/:jobId', deleteJob); // Delete a job posting
router.get('/:jobId/applications', getJobApplications); // View applications for a job

module.exports = router;
