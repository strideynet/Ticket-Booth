const bugsnag = require('bugsnag')
const cors = require('cors')
const config = require('config')
const db = require('./db')
const errors = require('./helpers/errors')
const express = require('express')
const router = require('./router')

const app = express()

const BUGSNAG = config.get('bugsnag')

if (process.env.NODE_ENV === 'production' && BUGSNAG) {
  bugsnag.register(BUGSNAG, {})

  app.use(bugsnag.requestHandler)
  app.use(bugsnag.errorHandler)
}

app.use(cors())
app.use(express.json())
app.use('/api', router)

db.sync()

errors.handlerAdder(app)

app.listen(8081, () => {
  console.log('Listening')
})
