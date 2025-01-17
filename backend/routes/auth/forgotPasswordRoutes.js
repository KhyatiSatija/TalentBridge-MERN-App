const express = require('express');
const { forgotPassword } = require('../../controllers/auth/forgotPasswordController');
const router = express.Router();

router.post('/', forgotPassword);

module.exports = router;

