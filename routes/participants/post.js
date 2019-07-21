const db = require('../../db')
const { GenericError } = require('../../helpers/errors')

module.exports = async (req, res, next) => {
  const participant = req.body

  if (!req.body.orderId) throw new GenericError('Participant order must be specified', 422)
  req.body.orderId = Number(req.body.orderId)

  const order = await db.models.Order.findOne({ where: { id: req.body.orderId } })
  if (!order) throw new GenericError('Specified participant parent order does not exist', 422)

  if (!participant.type) {
    participant.type = 'paying'
  }

  const updated = await db.models.Participant.create(req.body)

  res.status(200).json(updated)
}
