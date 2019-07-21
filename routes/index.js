const { ValidationError } = require('../helpers/errors')
const { asyncWrapper, authMiddleware } = require('../helpers/middleware')
const db = require('../db')
const generateQuote = require('../helpers/generate-quote')
const jwt = require('../helpers/jwt')
const router = require('express').Router()
const settings = require('../settings')

router.get('/settings', (req, res, next) => {
  db.models.Participant.count({})
    .then((c) => {
      res.status(200).json({
        ...settings,
        currentParticipants: c
      })
    }).catch(next)
})

/**
 * /quote provides a priced quote for the tickets
 *
 * Returns user to new route designed for handling post payment
 *
 */
router.post('/quotes', (req, res, next) => {
  if (!req.body) throw new ValidationError('body', null, 'body is missing')

  generateQuote(req.body).then((quote) => {
    jwt.sign({ quote }, 'quote').then((token) => {
      res.status(200).json({ quote, jwt: token })
    }).catch(next)
  }).catch(next)
})

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

router.get('/participants', authMiddleware, require('./participants/get'))
router.patch('/participants/:id', authMiddleware, asyncWrapper(require('./participants/patch')))
router.delete('/participants/:id', authMiddleware, asyncWrapper(require('./participants/delete')))
router.post('/participants', authMiddleware, asyncWrapper(require('./participants/post')))

module.exports = router
