const db = require('../db')
const moment = require('moment')
const router = require('express').Router()
const settings = require('../settings')
const { authMiddleware, asyncWrapper } = require('../helpers/middleware')

const setupDownload = (filename, fileContent, res) => {
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment;filename="${filename}-${Date.now()}.csv"`)
  res.send(fileContent)
}

router.get('/raceplates', asyncWrapper(async (req, res, next) => {
  let csv = 'PlateNumber,Nickname,Age\n'

  const participants = await db.models.participant.findAll({
    where: {},
    include: [{
      model: db.models.order,
      where: {
        status: 'CONFIRMED'
      }
    }]
  })

  for (const participant of participants) {
    const age = moment(settings.bashDate).diff(participant.dob, 'years')

    csv = csv.concat(`${participant.plateNumber},${participant.nick},${age}\n`)
  }
  setupDownload('raceplates', csv, res)
}))

router.get('/labels', asyncWrapper(async (req, res, next) => {
  let csv = 'PartyName,OrderId'

  const orders = await db.models.order.findAll({
    where: {
      status: 'CONFIRMED'
    },
    include: [{
      model: db.models.participant
    }]
  })

  let maxParticipants = 0
  for (const order of orders) {
    if (order.participants.length > maxParticipants) {
      maxParticipants = order.participants.length
    }
  }

  for (let i = 0; i < maxParticipants; i++) {
    csv = csv.concat(`,Participant${i}`)
  }
  csv = csv.concat('\n')

  for (const order of orders) {
    csv = csv.concat(`${order.partyName},${order.id}`)

    for (let i = 0; i < maxParticipants; i++) {
      if (order.participants[i]) {
        const ptcpt = order.participants[i]
        csv = csv.concat(`,${ptcpt.plateNumber} ${ptcpt.first} ${ptcpt.last}`)
      } else {
        csv = csv.concat(',')
      }
    }
    csv = csv.concat('\n')
  }

  setupDownload('labels', csv, res)
}))

router.get('/emails', asyncWrapper(async (req, res, next) => {
  let csv = 'Email\n'

  const orders = await db.models.order.findAll({
    where: {
      status: 'CONFIRMED'
    }
  })

  for (const order of orders) {
    csv = csv.concat(`${order.email}\n`)
  }

  setupDownload('emails', csv, res)
}))

router.get('/registration', authMiddleware, asyncWrapper(async (req, res, next) => {
  let csv = 'PartyName,OrderId'

  const orders = await db.models.order.findAll({
    where: {
      status: 'CONFIRMED'
    },
    include: [{
      model: db.models.participant
    }]
  })

  let maxParticipants = 0
  for (const order of orders) {
    if (order.participants.length > maxParticipants) {
      maxParticipants = order.participants.length
    }
  }

  for (let i = 0; i < maxParticipants; i++) {
    csv = csv.concat(`,Participant${i}`)
  }
  csv = csv.concat('\n')

  for (const order of orders) {
    csv = csv.concat(`${order.partyName},${order.id}`)

    for (let i = 0; i < maxParticipants; i++) {
      if (order.participants[i]) {
        const ptcpt = order.participants[i]
        csv = csv.concat(`,${ptcpt.plateNumber} ${ptcpt.first} ${ptcpt.last} ${ptcpt.mobile || 'no mobile'}`)
      } else {
        csv = csv.concat(',')
      }
    }
    csv = csv.concat('\n')
  }

  setupDownload('registration', csv, res)
}))

module.exports = router
