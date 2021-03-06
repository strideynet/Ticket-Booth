const db = require('../../db')
const { asyncWrapper} = require('../../helpers/middleware')

module.exports = asyncWrapper(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        throw new Error("username and password must be specified")
    }

    const newUser = db.models.user.build({
        username: req.body.username
    })

    await newUser.setPassword(req.body.password)
    await newUser.save()

    res.status(204).end()
})
