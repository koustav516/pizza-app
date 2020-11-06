const express = require('express')
const router = express.Router();

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController')

const middlewareObj = require('../app/http/middlewares/index');

const { index } = homeController();
const { cart, update } = cartController();
const { login,register, logout ,postRegister, postLogin } = authController();
const { store, showAllOrders, showOrderStatus } = orderController();
const { adminIndex } = adminOrderController();
const { statusUpdate } = statusController();

const { guest, isLoggedIn, isAdmin } = middlewareObj

router.get('/', index);

//Auth routes
router.get('/login', guest ,login);
router.post('/login', postLogin);
router.get('/register', guest ,register);
router.post('/register', postRegister);
router.post('/logout', logout);

//Cart routes
router.get('/cart', cart);
router.post('/update-cart',update);

//Customer routes
router.post('/orders',isLoggedIn,store);
router.get('/customer/orders',isLoggedIn,showAllOrders);
router.get('/customer/orders/:id',isLoggedIn,showOrderStatus);

//Admin routes
router.get('/admin/orders',isAdmin,adminIndex);
router.post('/admin/order/status',isAdmin,statusUpdate)

module.exports = router;