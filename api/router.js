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

router.post('/order', (req, res, next) => {
  next()
})

router.post('/order/execute', (req, res, next) => {
  next()
})

module.exports = router
