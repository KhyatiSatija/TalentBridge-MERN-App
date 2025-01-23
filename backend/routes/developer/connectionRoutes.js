const express = require('express');
const { getMyConnections, updateConnection } = require('../../controllers/developer/connectionController');
const router = express.Router();

router.get('/', getMyConnections);
router.put('/', updateConnection);

module.exports = router;
