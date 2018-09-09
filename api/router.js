const router = require('express').Router()

router.get('/settings', (req, res, next) => {
  res.status(200).json({
    maxParticipants: 800,
    currentParticipants: 10,
    salesOpen: Date.now(),
    bashDate: '2019-08-23',
    ticketTypes: {
      u5: {
        price: 0.01,
        priority: 3,
        criteria: {
          age: {
            condition: 'lt',
            value: 5
          }
        }
      },
      u18: {
        price: 100,
        priority: 2,
        criteria: {
          age: {
            condition: 'lt',
            value: 18
          }
        }
      },
      adult: {
        price: 200,
        priority: 1,
        criteria: {
          age: {
            condition: 'gt',
            value: 18
          }
        }
      }
    }
  })
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
