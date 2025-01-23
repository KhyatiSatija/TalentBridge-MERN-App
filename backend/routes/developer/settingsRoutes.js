const express = require('express');
const {
  updateEmail,
  changePassword,
  updatePhoneNumber,
  deleteAccount,
} = require('../../controllers/developer/settingsController');

const router = express.Router();

// Routes
router.put('/update-email', updateEmail); // Update email
router.put('/change-password', changePassword); // Change password
router.put('/update-phone', updatePhoneNumber); // Update phone number
router.delete('/delete-account', deleteAccount); // Delete account

module.exports = router;
