const express = require('express')
const router = express.Router();

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');

const middlewareObj = require('../app/http/middlewares/index');

const { index } = homeController();
const { cart, update } = cartController();
const { login,register, logout ,postRegister, postLogin } = authController();

const { isLoggedIn } = middlewareObj

router.get('/', index);
router.get('/login', isLoggedIn ,login);
router.post('/login', postLogin);
router.get('/register', isLoggedIn ,register);
router.post('/register', postRegister);
router.get('/cart', cart);
router.post('/update-cart',update);
router.post('/logout', logout);

module.exports = router;