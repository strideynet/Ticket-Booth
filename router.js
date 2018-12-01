const errors = require('./helpers/errors').types
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
  if (!req.body) throw new errors.ValidationError('No body supplied.')

  generateQuote(req.body).then((quote) => {
    jwt.sign({ quote }, 'quote').then((token) => {
      res.status(200).json({ quote, jwt: token })
    }).catch((err) => next(err))
  }).catch((err) => next(err))
})

/** Payment API handlers **/
router.post('/payment', require('./routes/payment/post'))
router.post('/payment/execute', require('./routes/payment/execute'))

router.get('/orders/:id/:secret', require('./routes/orders/get-single'))

module.exports = router
