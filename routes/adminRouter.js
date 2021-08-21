const express = require('express');
const admin = require('../controllers/adminController');
const access = require('../controllers/accessController');
const passport = require('passport');
const upload = require('../utils/uploadconfig');
const router = express.Router();

router.get('/gestion', access.isAuthenticated,access.isAllowed, admin.getGestionPanel);
router.get('/admin', access.isAuthenticated, access.isAdmin, admin.getAdminPanel);
router.get('/admin/users', access.isAuthenticated, access.isAdmin, admin.getUsersPage);
router.get('/admin/user/allowaccess/:id', access.isAuthenticated, access.isAdmin, admin.allowUser);
router.get('/admin/user/removeaccess/:id', access.isAuthenticated, access.isAdmin, admin.disallowUser);
router.post('/admin', upload.single('menuitemimage'), access.isAuthenticated, access.isAdmin, admin.postAdmin);
router.post('/admin/delete/:id', access.isAuthenticated, access.isAdmin, admin.deleteItem);
router.post('/admin/user/delete/:id', access.isAuthenticated, access.isAdmin, admin.deleteUser);
module.exports = router;
