const db = require('../../db')
const errors = require('../../helpers/errors').types

module.exports = (req, res, next) => {
  if (req.params.id && req.params.secret) {
    db.models.Order.findOne({where: {id: req.params.id}})
      .then((order) => {
        if (order) {
          console.log(order)
          return Promise.all([order, order.getParticipants()])
        } else {
          throw new errors.ValidationError('Order does not exist.')
        }
      })
      .then(([order, participants]) => {
        const plain = order.get({plain: true})

        plain.participants = participants

        if (req.params.secret !== order.secret) {
          throw new errors.ValidationError('Secret incorrect!')
        }

        res.status(200).json(plain)
      })
      .catch(next)
  } else {
    throw new errors.ValidationError('Missing fields id or secret')
  }
}
