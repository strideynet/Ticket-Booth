const cors = require('cors')
const config = require('config')
const debug = require('debug')('ticket-booth:entry')
const db = require('./db')
const errors = require('./helpers/errors')
const express = require('express')
const router = require('./router')

const app = express()

app.use(cors())
app.options('*', cors())
app.use(express.json())

app.use('/api', router)

db.sync().catch((err) => {
  debug('db sync failed')
  debug(err)

  process.exit(1)
})

errors.handlerAdder(app)

app.listen(8081, () => {
  console.log('Listening')
})
