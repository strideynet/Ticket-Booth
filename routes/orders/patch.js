const db = require('../../db')
const { GenericError } = require('../../helpers/errors')

module.exports = async (req, res, next) => {
  try {
    const order = await db.models.order.findOne({ where: { id: req.params.id } })
    if (!order) throw new GenericError('Specified order does not exist', 404)

    const updated = await order.update(req.body)

    res.status(200).json(updated)
  } catch (e) {
    next(e)
  }
}
