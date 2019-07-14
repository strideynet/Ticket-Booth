const db = require('../../db')
const { GenericError } = require('../../helpers/errors')

module.exports = async (req, res, next) => {
  const participant = await db.models.Participant.findOne({ where: { id: req.params.id } })
  if (!participant) throw new GenericError('Specified user does not exist', 404)

  await participant.destroy()

  res.status(200).json({})
}
