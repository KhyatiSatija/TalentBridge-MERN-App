const express = require('express');
const {getDeveloperApplications, updateDeveloperApplications } = require('../../controllers/developer/applicationController');
const router = express.Router();

router.get('/', getDeveloperApplications);
router.put('/', updateDeveloperApplications);

module.exports = router;
