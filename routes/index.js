const { ValidationError } = require('../helpers/errors')
const { asyncWrapper, authMiddleware } = require('../helpers/middleware')
const db = require('../db')
const generateQuote = require('../helpers/generate-quote')
const jwt = require('../helpers/jwt')
const router = require('express').Router()
const moment = require('moment')
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

const setupDownload = (filename, fileContent, res) => {
  res.setHeader('Content-Type', 'text/tab-separated-values')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}-${Date.now()}.tsv"`)
  res.send(fileContent)
}

const regenPlates = async () => {
  await db.query('SELECT @n:=0;UPDATE participants SET plateNumber = @n := @n + 1 ORDER BY id ASC;')
}

router.get('/exports/raceplates', authMiddleware, asyncWrapper(async (req, res) => {
  await regenPlates()
  let tsv = 'PlateNumber\tNickname\tAge\n'

  const participants = await db.models.Participant.findAll({
    where: {},
    include: [{
      model: db.models.Order,
      where: {
        status: 'CONFIRMED'
      }
    }]
  })

  for (const participant of participants) {
    const age = moment(settings.bashDate).diff(participant.dob, 'years')

    tsv = tsv.concat(`${participant.plateNumber}\t${participant.nick}\t${age}\n`)
  }
  setupDownload('raceplates', tsv, res)
}))

router.get('/exports/labels', authMiddleware, asyncWrapper(async (req, res) => {
  await regenPlates()
  let tsv = 'PartyName\tOrderId'

  const orders = await db.models.Order.findAll({
    where: {
      status: 'CONFIRMED'
    },
    include: [{
      model: db.models.Participant
    }]
  })

  let maxParticipants = 0
  for (const order of orders) {
    if (order.participants.length > maxParticipants) {
      maxParticipants = order.participants.length
    }
  }

  for (let i = 0; i < maxParticipants; i++) {
    tsv = tsv.concat(`\tParticipant${i}`)
  }
  tsv = tsv.concat('\n')

  for (const order of orders) {
    tsv = tsv.concat(`${order.partyName}\t${order.id}`)

    for (let i = 0; i < maxParticipants; i++) {
      if (order.participants[i]) {
        const ptcpt = order.participants[i]
        tsv = tsv.concat(`\t${ptcpt.plateNumber} ${ptcpt.first} ${ptcpt.last}`)
      } else {
        tsv = tsv.concat(`\t`)
      }
    }
    tsv = tsv.concat('\n')
  }

  setupDownload('labels', tsv, res)
}))

router.get('/exports/registration', authMiddleware, asyncWrapper(async (req, res) => {
  await regenPlates()
  let tsv = 'PartyName\tOrderId'

  const orders = await db.models.Order.findAll({
    where: {
      status: 'CONFIRMED'
    },
    include: [{
      model: db.models.Participant
    }]
  })

  let maxParticipants = 0
  for (const order of orders) {
    if (order.participants.length > maxParticipants) {
      maxParticipants = order.participants.length
    }
  }

  for (let i = 0; i < maxParticipants; i++) {
    tsv = tsv.concat(`\tParticipant${i}`)
  }
  tsv = tsv.concat('\n')

  for (const order of orders) {
    tsv = tsv.concat(`${order.partyName}\t${order.id}`)

    for (let i = 0; i < maxParticipants; i++) {
      if (order.participants[i]) {
        const ptcpt = order.participants[i]
        tsv = tsv.concat(`\t${ptcpt.plateNumber} ${ptcpt.first} ${ptcpt.last} ${ptcpt.mobile || 'no mobile'}`)
      } else {
        tsv = tsv.concat(`\t`)
      }
    }
    tsv = tsv.concat('\n')
  }

  setupDownload('registration', tsv, res)
}))

module.exports = router
