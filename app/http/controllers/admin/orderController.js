const Order = require('../../../models/orders');

function adminOrderController() {
    return {
        adminIndex(req, res) {
            Order.find({
                status: {
                    $ne: 'completed'  //show all orders that are not completed
                }
            }, null, {
                sort: {
                    'createdAt': -1
                }
            }).populate('customerId', '-password').exec((err,orders) =>{
                if(req.xhr) {
                    return res.json(orders)
                }
                return res.render('admin/orders');
            }) 
        }
    }
}

module.exports = adminOrderController;