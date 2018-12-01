const db = require('../../db')
const errors = require('../../helpers/errors').types
const emails = require('../../helpers/mail')
const jwt = require('../../helpers/jwt')
const paypal = require('../../helpers/paypal')

function paypalExecute (id, payerID) {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(id, {payer_id: payerID}, (err, payment) => {
      if (err) return reject(err)

      resolve(payment)
    })
  })
}

module.exports = (req, res, next) => {
  if (!req.body.paymentJWT) {
    throw new errors.ValidationError('Payment JWT field missing')
  }

  jwt.decode(req.body.paymentJWT)
    .then((decoded) => {
      if (!decoded.paymentID) {
        console.log(decoded)
        throw new errors.ValidationError('Payment ID field missing')
      }

      if (!req.body.payerID) {
        throw new errors.ValidationError('Payer ID field missing')
      }

      return db.transaction((t) => {
        let order = null

        return db.models.Order
          .create({
            paypalPayment: decoded.paymentID,
            value: decoded.quote.totalPrice,
            partyName: decoded.partyName,
            yearsAtTheBash: decoded.yearsAtTheBash,
            email: decoded.email
          }, {transaction: t})
          .then((obj) => {
            order = obj

            let toCreate = decoded.quote.participants.map((participant) => ({
              ...participant,
              orderId: order.id
            }))

            return db.models.Participant.bulkCreate(toCreate, {transaction: t})
          })
          .then(() => paypalExecute(decoded.paymentID, req.body.payerID))
          .then(() => (order))
      })
    })
    .then((order) => {
      res.status(200).json(order)
      emails.receipt(order)
    })
    .catch(next)
}
