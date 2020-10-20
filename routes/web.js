const express = require('express')
const router = express.Router();

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');

const middlewareObj = require('../app/http/middlewares/index');

const { index } = homeController();
const { cart, update } = cartController();
const { login,register, logout ,postRegister, postLogin } = authController();
const { store, showAllOrders } = orderController();

const { isLoggedIn } = middlewareObj

router.get('/', index);

router.get('/login', isLoggedIn ,login);
router.post('/login', postLogin);
router.get('/register', isLoggedIn ,register);
router.post('/register', postRegister);
router.post('/logout', logout);

router.get('/cart', cart);
router.post('/update-cart',update);
router.post('/orders',store);
router.get('/customer/orders',showAllOrders);



module.exports = router;