const express = require('express');
const db = require('./dbConnection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signupValidation, loginValidation } = require('./validation');
const controller = require('./controller');
const { validationResult } = require('express-validator');

const router = express.Router();
router.post('/register', signupValidation, controller.registerUser);

router.post('/login', loginValidation, controller.loginUser);

router.post('/get-user', signupValidation, controller.fetchUser);

module.exports = router;
