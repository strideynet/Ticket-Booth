const db = require('../../db')
const { GenericError, ValidationError } = require('../../helpers/errors')

module.exports = async (req, res, next) => {
  try {
    if (!(req.params.id && req.params.secret)) {
      throw new ValidationError('secret or id', '', 'not provided')
    }

    const order = await db.models.Order.findOne({ where: { id: req.params.id } })
    if (!order) {
      throw new GenericError('Order does not exist', 404)
    }

    const participants = await order.getParticipants()
    const plain = order.get({ plain: true })
    plain.participants = participants

    if (req.params.secret !== order.secret) {
      throw new GenericError('Specified secret incorrect', 403)
    }

    res.status(200).json(plain)
  } catch (e) {
    next(e)
  }
}
