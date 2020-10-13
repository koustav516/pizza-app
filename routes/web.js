const express = require('express')
const router = express.Router();

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');

const { index } = homeController();
const { cart, update } = cartController();
const { login,register } = authController();


router.get('/', index);
router.get('/login', login);
router.get('/register', register);
router.get('/cart', cart);
router.post('/update-cart',update)


module.exports = router;