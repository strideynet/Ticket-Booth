const db = require('../db')
const moment = require('moment')
const router = require('express').Router()
const settings = require('../settings')
const { authMiddleware } = require('../helpers/middleware')

const setupDownload = (filename, fileContent, res) => {
  res.setHeader('Content-Type', 'text/tab-separated-values')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}-${Date.now()}.tsv"`)
  res.send(fileContent)
}

router.get('/raceplates', authMiddleware, async (req, res, next) => {
  try {
    let tsv = 'PlateNumber\tNickname\tAge\n'

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

      tsv = tsv.concat(`${participant.plateNumber}\t${participant.nick}\t${age}\n`)
    }
    setupDownload('raceplates', tsv, res)
  } catch (e) {
    next(e)
  }
})

router.get('/labels', authMiddleware, async (req, res, next) => {
  try {
    let tsv = 'PartyName\tOrderId'

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
          tsv = tsv.concat('\t')
        }
      }
      tsv = tsv.concat('\n')
    }

    setupDownload('labels', tsv, res)
  } catch (e) {
    next(e)
  }
})

router.get('/registration', authMiddleware, async (req, res, next) => {
  try {
    let tsv = 'PartyName\tOrderId'

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
          tsv = tsv.concat('\t')
        }
      }
      tsv = tsv.concat('\n')
    }

    setupDownload('registration', tsv, res)
  } catch (e) {
    next(e)
  }
})

module.exports = router
