const db = require('../../db')

module.exports = async (req, res, next) => {
  const order = req.body

  if (!order.status) {
    order.status = 'CONFIRMED'
  }

  if (!order.type) {
    order.type = 'MANUAL_PURCHASE'
  }

  const updated = await db.models.Order.create(order)
  res.status(200).json(updated)
}
