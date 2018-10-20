const router = require('express').Router()
const settings = require('./settings')
const generateQuote = require('./helpers/generate-quote')
const jwt = require('./helpers/jwt')
const db = require('./db')

router.get('/settings', (req, res, next) => {
  db.models.Participant.count({})
    .then((c) => {
      res.status(200).json({
        ...settings,
        currentParticipants: c
      })
    }).catch((err) => next(err))
})

/**
 * /quote provides a priced quote for the tickets
 *
 * Returns user to new route designed for handling post payment
 *
 */
router.post('/quotes', (req, res, next) => {
  if (!req.body) return res.status(422).json({err: 'No body supplied.'})

  generateQuote(req.body).then((quote) => {
    jwt.sign({ quote }, 'quote').then((token) => {
      res.status(200).json({ quote, jwt: token })
    }).catch((err) => next(err))
  }).catch((err) => next(err))
})

/**
 * /payment
 *
 * User submits their order and information. This is compiled into a JWT
 * and the user is also sent the paypal payment id and other shit
 */
router.post('/payment', require('./routes/payment/post'))

/**
 * Finalises order and executes.
 */
router.get('/payment/execute', (req, res, next) => {
  next()
})

module.exports = router
