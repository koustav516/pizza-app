function cartController() {
    return {
        cart(req,res) {
            res.render('customers/cart');
        },
        update(req,res) {
            if(!req.session.cart) {        //If there is an empty cart
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart;
            if(!cart.items[req.body._id]){  // If the item does not exist on cart
                cart.items[req.body._id] = {
                    item: req.body,
                    quantity: 1
                }
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }else{
                cart.items[req.body._id].quantity += 1;
                cart.totalQty += 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }
            return res.json({
                totalQuantity: req.session.cart.totalQty
            })
        }
    }
}

module.exports = cartController;