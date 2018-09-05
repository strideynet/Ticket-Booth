const express = require('express')
const router = require('./router')

const app = express()

app.use(express.json())
app.use('/api', router)

app.listen(8081, () => {
  console.log('Listening')
})
