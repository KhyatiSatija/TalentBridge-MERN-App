const express = require('express');
const { getDeveloperCards, updateConnection } = require('../../controllers/developer/connectController');
const router = express.Router();

router.get('/', getDeveloperCards); // Fetch developer cards
router.post('/', updateConnection); // Record swipe action

module.exports = router;
