const express = require('express');
const { rejectAppliedDeveloper, 
    underProcessAppliedDeveloper,
    hireUnderProcessDeveloper, 
    rejectUnderProcessDeveloper, 
    moveRejectedToUnderProcess, 
    viewDeveloperProfile } = require('../../controllers/company/applicationController');

const router = express.Router();

// Route to reject a developer's application
router.put('/reject', rejectAppliedDeveloper);

// Route to move a developer's application to under process
router.put('/process', underProcessAppliedDeveloper);

// Route to hire a developer
router.put('/hire', hireUnderProcessDeveloper);

// Route to reject a developer who is under process
router.put('/reject-under-process', rejectUnderProcessDeveloper);

// Route to move a rejected developer to under process
router.put('/move-rejected-to-under-process', moveRejectedToUnderProcess);

// Route to view a developer's profile
router.get('/developer/:developerId', viewDeveloperProfile);

module.exports = router;
