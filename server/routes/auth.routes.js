// const express = require('express');
// const router = express.Router();
// const { enroll } = require('../controllers/auth.controller');

// router.post('/enroll', enroll);

// module.exports = router;

// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// ✅ Login Route
router.post('/login', authController.login);

// ✅ Enroll Route (New User Registration)
router.post('/enroll', authController.enroll);

module.exports = router;

