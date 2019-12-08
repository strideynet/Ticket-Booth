const db = require('../db')
const jwt = require('../helpers/jwt')
const { ValidationError, GenericError } = require('../helpers/errors')
/**
 * Endpoint for logging in as admin
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports = async (req, res, next) => {
  try {
    if (!(req.body.user && req.body.pass)) {
      throw new ValidationError('user or pass', '', 'missing')
    }
    const user = await db.models.User.findOne({ where: { username: req.body.user } })
    if (!user) {
      throw new GenericError('Credentials incorrect', 401)
    }

    const passwordCorrect = await user.comparePassword(req.body.pass)
    if (!passwordCorrect) {
      throw new GenericError('Credentials incorrect', 401)
    }

    const authJWT = {
      userId: user.id
    }
    const token = await jwt.sign(authJWT, 'auth')

    res.status(200).json({
      user: req.body.user,
      token
    })
  } catch (e) {
    next(e)
  }
}
