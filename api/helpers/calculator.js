const moment = require('moment')
const settings = require('../settings')

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

function generateQuote (participants) {
  let participantsSorted = {
    u5: [],
    u18: [],
    adult: []
  }

  participants.forEach((participant) => {
    let age = moment(settings.bashDate).diff(participant.dob, 'years')

    if (age < 5) {
      participantsSorted.u5.push(participant)
    } else if (age < 18) {
      participantsSorted.u18.push(participant)
    } else if (age >= 18) {
      participantsSorted.adult.push(participant)
    } else {
      throw new Error('Participant without age.')
    }
  })

  let ticketsSorted = {
    u5: [],
    u18: [],
    adult: [],
    family: []
  }

  while (participantsSorted.adult.length >= 2) {
    if (participantsSorted.u5.length + participantsSorted.u18.length > 0) {
      let familyTicket = []

      for (let i = 0; i < 2; i++) {
        if (participantsSorted.u18.length > 0) {
          familyTicket.push(participantsSorted.u18.pop())
        } else {
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
}

module.exports = generateQuote
