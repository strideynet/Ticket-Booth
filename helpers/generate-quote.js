const moment = require('moment')
const settings = require('../settings')
const Participant = require('../db').models.Participant
const { GenericError } = require('../helpers/errors')

const ticketTypes = {
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
}

async function generateQuote (participants) {
  let participantsSorted = {
    u5: [],
    u18: [],
    adult: []
  }

  for (let i = 0; i < participants.length; i++) {
    const participant = Participant.build(participants[i])
    await participant.validate()

    let age = moment(settings.bashDate).diff(participant.dob, 'years')

    if (age < 5) {
      participantsSorted.u5.push(participant)
    } else if (age < 18) {
      participantsSorted.u18.push(participant)
    } else if (age >= 18) {
      participantsSorted.adult.push(participant)
    } else {
      throw new GenericError('participant age incorrect')
    }
  }

  let ticketsSorted = {
    u5: [],
    u18: [],
    adult: [],
    family: []
  }

  // Create family tickets.
  while (participantsSorted.adult.length >= 2) {
    if (participantsSorted.u5.length + participantsSorted.u18.length > 0) {
      let familyTicket = []

      for (let i = 0; i < 2; i++) {
        if (participantsSorted.u18.length > 0) {
          familyTicket.push(participantsSorted.u18.pop())
        } else if (participantsSorted.u5.length > 0) {
          familyTicket.push(participantsSorted.u5.pop())
        }
      }

      for (let i = 0; i < 2; i++) {
        familyTicket.push(participantsSorted.adult.pop())
      }

      ticketsSorted.family.push(familyTicket)
    } else {
      break
    }
  }

  let purchases = []
  let totalPrice = 0

  // Transfer remaining tickets
  for (let ticketType in ticketsSorted) {
    if (participantsSorted[ticketType] && participantsSorted[ticketType].length > 0) {
      ticketsSorted[ticketType] = ticketsSorted[ticketType].concat(participantsSorted[ticketType])
    }

    let purchase = {
      ...ticketTypes[ticketType],
      count: ticketsSorted[ticketType].length,
      totalPrice: ticketsSorted[ticketType].length * ticketTypes[ticketType].price
    }
    purchases.push(purchase)

    totalPrice += purchase.totalPrice
  }

  return {
    totalPrice,
    ticketsSorted,
    purchases,
    participants
  }
}

module.exports = generateQuote
