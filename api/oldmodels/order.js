const mongoose = require('mongoose')

let orderSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now()},
  customerID: {type: mongoose.Schema.Types.ObjectID, ref: 'Order'},
  paypalTransaction: String,
  value: Number
})

let Order = mongoose.model('Order', orderSchema)

module.exports = {schema: orderSchema, model: Order}