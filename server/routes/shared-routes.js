const express = require('express');
const { check } = require('express-validator');

const authContoller = require('../controllers/auth-controller');

const router = express.Router();

router.post(
  '/login',
  authContoller.login
);

module.exports = router;
