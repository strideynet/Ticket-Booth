const router = require('express').Router()
const generateQuote = require('./helpers/calculator')

router.get('/settings', (req, res, next) => {
  res.status(200).json({
    maxParticipants: 800,
    currentParticipants: 10,
    salesOpen: Date.now(),
    bashDate: '2019-08-23'
  })
})

/**
 * /quote provides a priced quote for the tickets
 *
 * Returns user to new route designed for handling post payment
 *     ticketTypes: {
      u5: {
        name: 'Under 5',
        price: 1
      },
      u18: {
        name: 'Under 18',
        price: 25
      },
      adult: {
        name: 'Adult',
        price: 100
      },
      family: {
        name: 'Family',
        price: 200
      }
 */
router.post('/quote', (req, res, next) => {
  let quote = generateQuote(req.body)

  res.status(200).json(quote)
})

/**
 * /order creates the order and prices it up. It returns the paypal URL to redirect to.
 *
 * Returns user to new route designed for handling post payment
 */
router.post('/order', (req, res, next) => {
  next()
})

/**
 * Return from Paypal API to here. Redirects to the appropriate front-end page with query string for order ID
 */
router.post('/order/return', (req, res, next) => {
  next()
})

/**
 * Allows client to fetch just completed order details.
 */
router.get('/order', (req, res, next) => {
  next()
})

module.exports = router
