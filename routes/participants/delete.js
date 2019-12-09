const db = require('../../db')
const { GenericError } = require('../../helpers/errors')

module.exports = async (req, res, next) => {
  try {
    const participant = await db.models.participant.findOne({ where: { id: req.params.id } })
    if (!participant) throw new GenericError('Specified user does not exist', 404)

    await participant.destroy()

    res.status(200).json({})
  } catch (e) {
    next(e)
  }
}
