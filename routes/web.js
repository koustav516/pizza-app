const express = require('express')
const router = express.Router();

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');

const { index } = homeController();
const { cart } = cartController();
const { login,register } = authController();


router.get('/', index);
router.get('/cart', cart);
router.get('/login', login);
router.get('/register', register);


module.exports = router;