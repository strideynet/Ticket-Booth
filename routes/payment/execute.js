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

function convertShippingAddress(raw) {
  let builtString = ""
  const fields = ["recipient_name", "line1", "line2", "city", "postal_code", "country_code"]
  for (let field of fields) {
    if (raw[field]) {
      builtString += (raw[field] + "\n")
    }
  }
  return builtString
}

module.exports = async (req, res, next) => {
  let dbTx = null
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

    dbTx = await db.transaction()

    const orderFields = {
      paypalPayment: decoded.paymentId,
      value: decoded.totalPrice,
      partyName: decoded.partyName,
      yearsAtTheBash: decoded.yearsAtTheBash,
      email: decoded.email,
      type: 'PORTAL_PURCHASE',
      status: 'CONFIRMED',
      registrationPlates: decoded.registrationPlates
    }
    logger.debug(orderFields, 'creating order')

    const order = await db.models.order.create(orderFields, { transaction: dbTx })

    const toCreate = decoded.participants.map(participant => ({
      ...participant,
      orderId: order.id
    }))
    logger.debug(toCreate, 'creating participants')

    await db.models.participant.bulkCreate(toCreate, { transaction: dbTx })

    const executedOrder = await executeOrder(decoded.paymentId, req.body.payerId)
    const paypalTx = executedOrder.transactions[0]
    const paypalTransactionId = paypalTx.related_resources[0].sale.id
    const shippingAddress = convertShippingAddress(paypalTx.item_list.shipping_address)
    
    await order.update({
      paypalTransactionId,
      shippingAddress
    }, { transaction: dbTx })

    await dbTx.commit()

    logger.info({
      paypalOrder: executedOrder,
      order: order,
    }, "order processed")

    try {
      await emails.receipt(order.get({ plain: true }))
      logger.info("sent receipt email succesfully")
    } catch(err) {
      logger.error({
        err,
        orderId: order.id,
      }, "failed to send receipt")
    }

    res.status(200).json(order)
  } catch (e) {
    if (dbTx) {
      await dbTx.rollback()
    }

    next(e)
  }
}
