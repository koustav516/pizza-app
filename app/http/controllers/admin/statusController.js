const Order = require('../../../models/orders')

function statusController() {
    return {
        statusUpdate(req,res) {
            Order.updateOne({ _id: req.body.orderId }, { orderStatus: req.body.status
            }, (err,data)=>{
                if(err) {
                    console.log(err);
                    return res.redirect('/admin/orders')
                }
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, orderStatus: req.body.status })
                return res.redirect('/admin/orders')
            });
        }
    }
}


module.exports = statusController;