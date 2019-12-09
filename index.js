const cors = require('cors')
const crypto = require('crypto')
const logger = require('pino')({
  name: 'main',
  level: process.env.LOG_LEVEL || 'info'
})

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
    db.models.user.findOne({ where: { username: 'root' } })
      .then(usr => {
        if (!usr) {
          const root = db.models.user.build({
            username: 'root'
          })
          logger.warn('generating root user')

          const pass = crypto.randomBytes(10).toString('hex')
          logger.warn('root pass: ' + pass)

          root.setPassword(pass)
            .then(() => root.save())
            .then(() => logger.warn('root user created'))
        } else {
          logger.info('root user already exists; root user generation not needed.')
        }
      })
  })
  .catch(err => {
    logger.fatal('db sync failed', err)

    process.exit(1)
  })

app.use(errors.genericErrorHandler)
app.listen(8081, () => {
  logger.info('Listening on 8081')
})
