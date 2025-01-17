const express = require('express');
const { resetPassword } = require('../../controllers/auth/resetPasswordController');
const router = express.Router();

router.post('/', resetPassword);

module.exports = router;
