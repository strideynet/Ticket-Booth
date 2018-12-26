const db = require('../../db')

module.exports = (req, res, next) => {
  db.models.Participant.findAll({})
    .then(participants => {
      res.status(200)
        .json(participants)
    })
    .catch(next)
}
