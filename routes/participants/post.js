const db = require('../../db')
const { GenericError } = require('../../helpers/errors')

module.exports = async (req, res, next) => {
  try {
    const participant = req.body

    if (!req.body.orderId) throw new GenericError('Participant order must be specified', 422)
    const order = await db.models.order.findOne({ where: { id: participant.orderId } })
    if (!order) throw new GenericError('Specified participant parent order does not exist', 422)

    if (!participant.type) {
      participant.type = 'PAYING'
    }

    const updated = (await db.models.participant.create(participant)).get({ plain: true })
    updated.order = order.get({ plain: true })

    res.status(200).json(updated)
  } catch (e) {
    next(e)
  }
}
