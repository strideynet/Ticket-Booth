const mongoose = require('mongoose')

let customerSchema = new mongoose.Schema({
  created: {type: Date, default: Date.now()},
})

let Customer = mongoose.model('Order', customerSchema)

module.exports = {schema: customerSchema, model: Customer}