const express = require('express');
const {
  updateEmail,
  updatePassword,
  deleteAccount,
  changeName,
} = require('../../controllers/company/settingsController');

const router = express.Router();

// Route to update email
router.put('/update-email', updateEmail);

// Route to update password
router.put('/update-password', updatePassword);

// Route to delete account
router.delete('/delete-account', deleteAccount);

// Route to change company name
router.put('/change-name', changeName);

module.exports = router;
