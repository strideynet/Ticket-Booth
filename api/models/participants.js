const mongoose = require('mongoose')

let participantSchema = new mongoose.Schema({
  first: String,
  last: String,
  nick: String,
  mobile: String,
  dob: Date,
  orderID: {type: mongoose.Schema.Types.ObjectID, ref: 'Order'},
  created: {type: Date, default: Date.now()},
  gender: String,
  type: String // "paying" "trade" ""
})

let Participant = mongoose.model('Participant', participantSchema)

module.exports = {schema: participantSchema, model: Participant}
