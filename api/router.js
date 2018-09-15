const router = require('express').Router()
const settings = require('./settings')
const generateQuote = require('./helpers/calculator')

router.get('/settings', (req, res, next) => {
  res.status(200).json(settings)
})

/**
 * /quote provides a priced quote for the tickets
 *
 * Returns user to new route designed for handling post payment
 *
 */
router.post('/quote', (req, res) => {
  req.body && res.status(200).json(generateQuote(req.body))
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
