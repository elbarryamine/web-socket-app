const express = require('express');
const auth = require('../controllers/authController');
const access = require('../controllers/accessController');
const upload = require('../utils/uploadconfig');
const router = express.Router();
const passport = require('passport');

router.get('/login', access.isNotAuthenticated, auth.getLoginPage);
router.get('/logout', auth.logoutUser);
router.get('/signup', access.isNotAuthenticated, auth.getSignUpPage);
router.post('/login', upload.none(), passport.authenticate('local', { successRedirect: '/gestion', failureRedirect: '/login', failureFlash: true }));
router.post('/signup', upload.none(), auth.signUser);
module.exports = router;
