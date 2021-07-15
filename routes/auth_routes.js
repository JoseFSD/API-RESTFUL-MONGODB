const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

// http://localhost:3000/api/auth
router.post("/", authController.login);

module.exports = router;