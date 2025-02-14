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

router.post('/create', createJob); 
router.get('/', getAllJobs); 
router.put('/:jobId', editJob); 
router.delete('/:jobId', deleteJob); 
router.get('/:jobId/applications', getJobApplications); 
router.patch('/:jobId', toggleJobApplications); 

module.exports = router;
