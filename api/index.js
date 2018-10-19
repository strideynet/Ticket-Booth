const express = require('express')
const router = require('./router')
const bugsnag = require('bugsnag')
const app = express()
const db = require('./db')

bugsnag.register('8729333ba977a064080331f47da7d76c')

app.use(bugsnag.requestHandler)
app.use(bugsnag.errorHandler)

app.use(express.json())
app.use('/api', router)

db.sync()

app.listen(8081, () => {
  console.log('Listening')
})
