const db = require('../../db')
const { GenericError, ValidationError } = require('../../helpers/errors')
const emails = require('../../helpers/mail')
const jwt = require('../../helpers/jwt')
const paypal = require('../../helpers/paypal')

function executeOrder (id, payerId) {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(id, { payer_id: payerId }, (err, payment) => {
      if (err) return reject(err)

      resolve(payment)
    })
  })
}

module.exports = async (req, res, next) => {
  let transaction = null
  try {
    if (!req.body.paymentJWT) {
      throw new ValidationError('JWT field', '', 'missing')
    }

    const decoded = await jwt.decode(req.body.paymentJWT)
    if (!decoded.paymentId) {
      throw new ValidationError('Payment ID field', '', 'missing')
    }

    if (!req.body.payerId) {
      throw new ValidationError('Payer ID', '', 'missing')
    }

    transaction = await db.transaction()
    const order = await db.models.Order.create({
      paypalPayment: decoded.paymentID,
      value: decoded.totalPrice,
      partyName: decoded.partyName,
      yearsAtTheBash: decoded.yearsAtTheBash,
      email: decoded.email,
      type: 'PORTAL_PURCHASE',
      status: 'CONFIRMED'
    }, { transaction })

    const toCreate = decoded.participants.map(participant => ({
      ...participant,
      orderId: order.id
    }))

    await db.models.Participant.bulkCreate(toCreate, { transaction })
    await executeOrder(decoded.paymentId, req.body.payerId)

    await transaction.commit()
    res.status(200).json(order)
    return emails.receipt(order)
  } catch (e) {
    if (transaction) {
      await transaction.rollback()
    }

    next(e)
  }
}
