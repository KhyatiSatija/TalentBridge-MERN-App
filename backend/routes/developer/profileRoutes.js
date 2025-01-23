const express = require('express');
const { getProfile, updateProfile } = require('../../controllers/developer/profileController');
const router = express.Router();

router.get('/', getProfile); // Fetch profile
router.put('/', updateProfile); // Update profile

module.exports = router;
