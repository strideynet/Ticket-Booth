const db = require('../../db')

module.exports = (req, res, next) => {
  db.models.Order.findAll({})
    .then(orders => {
      res.status(200)
        .json(orders)
    })
    .catch(next)
}
