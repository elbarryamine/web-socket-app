const express = require('express');
const admin = require('../controllers/adminController');
const access = require('../controllers/accessController');
const passport = require('passport');
const upload = require('../utils/uploadconfig');
const router = express.Router();

router.get('/gestion', access.isAuthenticated, admin.getGestionPanel);
router.get('/admin', access.isAuthenticated, access.isAdmin, admin.getAdminPanel);
router.post('/admin', upload.single('menuitemimage'), access.isAuthenticated, access.isAdmin, admin.postAdmin);
router.post('/admin/delete/:id', upload.single('menuitemimage'), access.isAuthenticated, access.isAdmin, admin.deleteItem);
module.exports = router;
