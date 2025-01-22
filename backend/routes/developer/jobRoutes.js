const express = require('express');
const { getJobCards, swipeOnJob } = require('../../controllers/developer/applyController');
const router = express.Router();

router.get('/', getJobCards); //Fetch job cards
router.post('/', swipeOnJob); //Record swipe action

module.exports = router;