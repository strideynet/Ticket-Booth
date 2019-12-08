const paypal = require('paypal-rest-sdk')
const config = require('config')

const MODE = process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
const ID = config.get('paypal.id')
const SECRET = config.get('paypal.secret')

paypal.configure({
  mode: MODE,
  client_id: ID,
  client_secret: SECRET
})

module.exports = paypal
