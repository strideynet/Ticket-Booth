const cors = require('cors')
const crypto = require('crypto')
const debug = require('debug')('ticket-booth:entry')
const db = require('./db')
const errors = require('./helpers/errors')
const express = require('express')
const router = require('./routes')

const app = express()

app.use(cors())
app.options('*', cors())
app.use(express.json())

app.use('/v1', router)

db.sync()
  .then(() => {
    /** Create root user if none exists */
    db.models.User.findOne({ where: { username: 'root' } })
      .then(usr => {
        if (!usr) {
          const root = db.models.User.build({
            username: 'root'
          })
          debug('generating root user')

          const pass = crypto.randomBytes(10).toString('hex')
          debug('root pass: ' + pass)

          root.setPassword(pass)
            .then(() => root.save())
            .then(() => debug('root user created'))
        } else {
          debug('root user already exists; root user generation not needed.')
        }
      })
  })
  .catch(err => {
    debug('db sync failed')
    debug(err)

    process.exit(1)
  })

app.use(errors.genericErrorHandler)
app.listen(8081, () => {
  debug('Listening')
})
