const db = require('../../db')

module.exports = async (req, res, next) => {
  try {
    const participants = await db.models.participant.findAll({
      include: [db.models.order]
    })
    res.status(200).json(participants)
  } catch (e) {
    next(e)
  }
}
