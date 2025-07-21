// // routes/attendance.routes.js
// const express = require('express');
// const router = express.Router();
// const { markAttendance } = require('../controllers/attendance.controller');

// router.post('/mark', markAttendance);

// module.exports = router;

const express = require('express');
const router = express.Router();

// ✅ Correctly import the controller functions
const {
  markAttendance,
  getLogs
} = require('../controllers/attendance.controller');

// ✅ Routes
router.post('/mark', markAttendance);  // ← This was crashing before
router.get('/logs', getLogs);

module.exports = router;

