const db = require('../../db')

module.exports = async (req, res, next) => {
  try {
    const users = await db.models.User.findAll({
      attributes: {
        exclude: ['hash']
      }
    })

    res.status(200).json(users)
  } catch (e) {
    next(e)
  }
}
