const db = require('../../db')
const { GenericError, ValidationError } = require('../../helpers/errors')
const emails = require('../../helpers/mail')
const jwt = require('../../helpers/jwt')
const paypal = require('../../helpers/paypal')

function paypalExecute (id, payerID) {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(id, { payer_id: payerID }, (err, payment) => {
      if (err) return reject(err)

      resolve(payment)
    })
  })
}

module.exports = (req, res, next) => {
  if (!req.body.paymentJWT) {
    throw new ValidationError('JWT field', '', 'missing')
  }

  jwt.decode(req.body.paymentJWT)
    .then((decoded) => {
      if (!decoded.paymentID) {
        throw new ValidationError('Payment ID field', '', 'missing')
      }

      if (!req.body.payerID) {
        throw new ValidationError('Payer ID', '', 'missing')
      }

      return db.transaction(t => {
        let order = null

        return db.models.Order
          .create({
            paypalPayment: decoded.paymentID,
            value: decoded.quote.totalPrice,
            partyName: decoded.partyName,
            yearsAtTheBash: decoded.yearsAtTheBash,
            email: decoded.email,
            type: 'PORTAL_PURCHASE',
            status: 'CONFIRMED'
          }, { transaction: t })
          .then((obj) => {
            order = obj

            let toCreate = decoded.quote.participants.map(participant => ({
              ...participant,
              orderId: order.id
            }))

            return db.models.Participant.bulkCreate(toCreate, { transaction: t })
          })
          .then(() => paypalExecute(decoded.paymentID, req.body.payerID))
          .then(() => (order))
      })
    })
    .then((order) => {
      res.status(200).json(order)
      return emails.receipt(order)
    })
    .catch(next)
}
