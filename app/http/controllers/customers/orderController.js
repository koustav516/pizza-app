const Order = require('../../../models/orders');
const moment = require('moment')

function orders() {
    return {
        store(req,res) {
            const { phone, address } = req.body;

            if(!phone || !address) {
                req.flash('error', 'All fields are required');
                return res.redirect('/cart');
            }

            const order = new Order({ 
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
             })

             order.save().then(result => {
                req.flash('success', 'Order placed succesfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
             }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/cart')
             });
        },

        async showAllOrders(req,res) {
            const orders = await Order.find({ customerId: req.user._id },null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control','private,no-cache,no-store,max-stale=0,must-revalidate,pre-check=0,post-check=0')
            res.render('customers/orders', { orders, moment });
        },
        async showOrderStatus(req,res) {
            const order = await Order.findById(req.params.id)
            //Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/orderStatus', { order })
            }
            return res.redirect('/')
        }
    }
}

module.exports = orders;