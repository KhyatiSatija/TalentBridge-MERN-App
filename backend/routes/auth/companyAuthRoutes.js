const express = require('express');
const { companySignup, companyLogin } = require('../../controllers/auth/companyAuthController');
const router = express.Router();

router.post('/signup', companySignup);
router.post('/login', companyLogin);

module.exports = router;
