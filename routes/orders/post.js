const db = require('../../db')

module.exports = async (req, res, next) => {
  try {
    const order = req.body

    if (!order.status) {
      order.status = 'CONFIRMED'
    }

    if (!order.type) {
      order.type = 'MANUAL_PURCHASE'
    }

    const updated = await db.models.order.create(order)
    res.status(200).json(updated)
  } catch (e) {
    next(e)
  }
}
