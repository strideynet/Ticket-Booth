const db = require('../../db')

module.exports = (req, res, next) => {
  db.models.User.findAll({
    attributes: {
      exclude: ['hash']
    }
  })
    .then(users => {
      res.status(200)
        .json(users)
    })
    .catch(next)
}
