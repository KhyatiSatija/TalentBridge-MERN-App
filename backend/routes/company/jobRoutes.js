const express = require('express');
const {
  createJob,
  getAllJobs,
  editJob,
  deleteJob,
  getJobApplications,
  toggleJobApplications,
} = require('../../controllers/company/jobController');
const router = express.Router();

router.post('/create', createJob); // Create a new job - DONE
router.get('/', getAllJobs); // Fetch all jobs by the company - DONE
router.put('/:jobId', editJob); // Edit a job posting - DONE
router.delete('/:jobId', deleteJob); // Delete a job posting - DONE
router.get('/:jobId/applications', getJobApplications); // View applications for a job
router.patch('/:jobId', toggleJobApplications); //DONE

module.exports = router;
