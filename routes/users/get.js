const db = require('../../db')
const { asyncWrapper} = require('../../helpers/middleware')

module.exports = asyncWrapper(async (req, res, next) => {
    const users = await db.models.user.findAll({
      attributes: {
        exclude: ['hash']
      }
    })

    res.status(200).json(users)
})
