const express = require('express');
const { getDeviceStatus } = require('../controllers/device.controller');
const router = express.Router();
router.get('/status', getDeviceStatus);
module.exports = router;