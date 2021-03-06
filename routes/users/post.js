const db = require('../../db')
const { asyncWrapper} = require('../../helpers/middleware')

module.exports = asyncWrapper(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        throw new Error("username and password must be specified")
    }

    const newUser = db.models.user.build({
        username: req.body.username
    })

    const pass = crypto.randomBytes(10).toString(req.body.password)

    await newUser.setPassword(pass)
    await newUser.save()

    res.status(204).end()
})
