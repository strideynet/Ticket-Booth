const db = require('../../db')

module.exports = async (req, res, next) => {
  try {
    const participants = await db.models.Participant.findAll({
      include: [db.models.Order]
    })
    res.status(200).json(participants)
  } catch (e) {
    next(e)
  }
}
