const db = require('../../db')

module.exports = async (req, res, next) => {
  try {
    const orders = await db.models.order.findAll({})
    res.status(200).json(orders)
  } catch (e) {
    next(e)
  }
}
