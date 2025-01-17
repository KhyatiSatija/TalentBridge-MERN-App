const express = require('express');
const { developerSignup, developerLogin } = require('../../controllers/auth/developerAuthController');
const router = express.Router();

router.post('/signup', developerSignup);
router.post('/login', developerLogin);

module.exports = router;
