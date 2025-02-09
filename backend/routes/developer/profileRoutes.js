const express = require('express');
const { upload, uploadProfilePhoto, getProfile, updateProfile } = require('../../controllers/developer/profileController');
const router = express.Router();

router.get('/profile', getProfile); // Fetch profile
router.put('/profile', updateProfile); // Update profile
router.put('/uploadProfilePhoto', upload.single("profilePhoto"), uploadProfilePhoto);

module.exports = router;
