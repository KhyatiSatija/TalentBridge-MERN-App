const express = require('express');
const { getDeveloperDashboard } = require('../../controllers/developer/dashboardController');
const router = express.Router();

router.get('/', getDeveloperDashboard);

module.exports = router;
