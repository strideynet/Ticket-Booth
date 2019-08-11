const db = require('../../db')

module.exports = (req, res, next) => {
  db.models.Participant.findAll({
    include: [ db.models.Order ]
  })
    .then(participants => {
      res.status(200)
        .json(participants)
    })
    .catch(next)
}
