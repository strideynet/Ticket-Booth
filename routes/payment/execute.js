const db = require('../../db')
const { GenericError, ValidationError } = require('../../helpers/errors')
const logger = require('pino')({
  name: 'payment-execution',
  level: process.env.LOG_LEVEL || 'info'
})
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

    const orderFields = {
      paypalPayment: decoded.paymentId,
      value: decoded.totalPrice,
      partyName: decoded.partyName,
      yearsAtTheBash: decoded.yearsAtTheBash,
      email: decoded.email,
      type: 'PORTAL_PURCHASE',
      status: 'CONFIRMED'
    }
    logger.debug(orderFields, 'creating order')

    const order = await db.models.order.create(orderFields, { transaction })

    const toCreate = decoded.participants.map(participant => ({
      ...participant,
      orderId: order.id
    }))
    logger.debug(toCreate, 'creating participants')

    await db.models.participant.bulkCreate(toCreate, { transaction })
    await executeOrder(decoded.paymentId, req.body.payerId)

    await transaction.commit()
    res.status(200).json(order)
    return emails.receipt(order.get({ plain: true }))
  } catch (e) {
    if (transaction) {
      await transaction.rollback()
    }

    next(e)
  }
}
