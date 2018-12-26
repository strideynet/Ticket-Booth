const db = require('../db')
const jwt = require('../helpers/jwt')
const errors = require('../helpers/errors').types

module.exports = (req, res, next) => {
  if (req.body.user && req.body.pass) {
    let user = null
    db.models.User.findOne({ where: { username: req.body.user } })
      .then(usr => {
        if (!usr) {
          throw new errors.ValidationError('Credentials incorrect')
        }

        user = usr
        return user.comparePassword(req.body.pass)
      })
      .then(correct => {
        if (!correct) {
          throw new errors.ValidationError('Credentials incorrect')
        }

        const authJWT = {
          userID: user.id
        }

        return jwt.sign(authJWT, 'auth')
      })
      .then(token => {
        res.status(200).json({
          user: req.body.user,
          token
        })
      })
      .catch(next)
  } else {
    throw new errors.ValidationError('Missing field')
  }
}
