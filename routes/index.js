const { ValidationError } = require('../helpers/errors')
const { asyncWrapper, authMiddleware } = require('../helpers/middleware')
const db = require('../db')
const generateQuote = require('../helpers/generate-quote')
const jwt = require('../helpers/jwt')
const router = require('express').Router()
const settings = require('../settings')

router.get('/settings', asyncWrapper(async (req, res) => {
  const count = await db.models.participant.count({
    include: [{
      model: db.models.order,
      where: {
        status: 'CONFIRMED'
      }
    }]
  })

  res.status(200).json({
    ...settings,
    currentParticipants: count
  })
}))

/**
 * /quote provides a priced quote for the tickets
 *
 * Returns user to new route designed for handling post payment
 *
 */
router.post('/quotes', asyncWrapper( async (req, res) => {
  if (!req.body) throw new ValidationError('body', null, 'body is missing')

  const quote = await generateQuote(req.body)
  const token = await jwt.sign(quote, 'quote')

  res.status(200).json({ quote, jwt: token })
}))

/** Payment API handlers **/
router.post('/payment', require('./payment/post'))
router.post('/payment/execute', require('./payment/execute'))

router.get('/orders', authMiddleware, require('./orders/get'))
router.get('/orders/:id/:secret', require('./orders/get-single'))
router.patch('/orders/:id', authMiddleware, asyncWrapper(require('./orders/patch')))
router.post('/orders', authMiddleware, asyncWrapper(require('./orders/post')))

router.post('/auth', require('./auth'))

router.get('/orders', authMiddleware, require('./orders/get'))

router.get('/users', authMiddleware, require('./users/get'))
router.post('/users', authMiddleware, require('./users/post'))

router.get('/participants', authMiddleware, require('./participants/get'))
router.patch('/participants/:id', authMiddleware, asyncWrapper(require('./participants/patch')))
router.delete('/participants/:id', authMiddleware, asyncWrapper(require('./participants/delete')))
router.post('/participants', authMiddleware, asyncWrapper(require('./participants/post')))

router.use('/exports', authMiddleware, require('./data-exports'))

module.exports = router
