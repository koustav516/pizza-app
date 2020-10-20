const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        default: 'COD'
    },
    orderStatus: {
        type: String,
        default: 'ORDER PLACED'
    }
}, { timestamps: true })


module.exports = mongoose.model('Order', orderSchema);