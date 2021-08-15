const express = require('express');
const admin = require('../controllers/adminController');
const access = require('../controllers/accessController');
const passport = require('passport');

const router = express.Router();

router.get('/admin', access.isAuthenticated, admin.getAdminPanel);
module.exports = router;
