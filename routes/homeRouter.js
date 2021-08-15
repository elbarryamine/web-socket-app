const express = require('express');
const home = require('../controllers/homeController');
const router = express.Router();

router.get('/', home.getHomePage);
router.get('/contact', home.getContactPage);
router.get('/menu', home.getMenuPage);
router.get('/services', home.getServicesPage);
router.get('/team', home.getTeamPage);
router.get('/about', home.getAboutPage);
module.exports = router;
