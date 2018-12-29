const db = require('../../db')
const { GenericError, ValidationError } = require('../../helpers/errors')

module.exports = (req, res, next) => {
  if (req.params.id && req.params.secret) {
    db.models.Order.findOne({ where: { id: req.params.id } })
      .then((order) => {
        if (order) {
          console.log(order)
          return Promise.all([order, order.getParticipants()])
        } else {
          throw new GenericError('Order does not exist', 404)
        }
      })
      .then(([order, participants]) => {
        const plain = order.get({ plain: true })

        plain.participants = participants

        if (req.params.secret !== order.secret) {
          throw new GenericError('Specified secret incorrect', 403)
        }

        res.status(200).json(plain)
      })
      .catch(next)
  } else {
    throw new ValidationError('secret or id', '', 'not provided')
  }
}
