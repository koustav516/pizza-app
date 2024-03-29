const Order = require('../../../models/orders');
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function orders() {
    return {
        store(req,res) {
            const { phone, address, stripeToken, paymentType } = req.body;

            if(!phone || !address) {
                return res.status(422).json({ message: 'All fields are required' });
            }

            const order = new Order({ 
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
             })
            //  order.save().then(result => {
            //     Order.populate(result, { path: 'customerId' }, (err, data) => {
            //         if(paymentType === 'card') {
            //             stripe.charges.create({
            //                 amount: req.session.cart.totalPrice * 100,
            //                 source: stripeToken,
            //                 currenct: 'inr',
            //                 description: `Pizza order: ${data._id}`
            //             }).then(()=> {
            //                 data.paymentStatus = true;
            //                 data.payment = paymentType;
            //                 data.save().then((ord) => {
            //                     //Emit event
            //                     const eventEmitter = req.app.get('eventEmitter')
            //                     eventEmitter.emit('orderPlaced', ord)
            //                     delete req.session.cart
            //                     return res.json({ message: 'Payment successfull, Order placed successfully' });
            //                 }).catch(err => console.log(err))
            //             }).catch(err => {
            //                 delete req.session.cart;
            //                 return res.json({ message: 'Order placed but payment failed, you can pay at delivary' });
            //             })
            //         }
            //         //return res.redirect('/customer/orders')
            //     })
            // }).catch(err => {
            //     return res.status(500).json({ message: 'Something went wrong' });
            // }) 
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    // req.flash('success', 'Order placed successfully')

                    // Stripe payment
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.payment = paymentType
                            placedOrder.save().then((ord) => {
                                // Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((err) => {
                                console.log(err)
                            })

                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                })
            }).catch(err => {
                return res.status(500).json({ message : 'Something went wrong' });
            })
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