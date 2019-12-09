const db = require('../../db')
const { GenericError } = require('../../helpers/errors')

module.exports = async (req, res, next) => {
  try {
    const participant = await db.models.participant.findOne({ where: { id: req.params.id } })
    if (!participant) throw new GenericError('Specified user does not exist', 404)

    const updated = await participant.update(req.body)

    res.status(200).json(updated)
  } catch (e) {
    next(e)
  }
}
