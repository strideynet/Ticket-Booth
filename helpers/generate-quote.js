const moment = require('moment')
const settings = require('../settings')
const Participant = require('../db').models.participant

const purchaseTypes = {
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
    price: 115
  },
  family: {
    name: 'Family',
    price: 230
  },
  adultBnbAddon: {
    name: 'Adult Bed and Breakfast Addon',
    price: 50
  },
  childBnbAddon: {
    name: 'Under 18 Bed and Breakfast Addon',
    price: 30
  }
}

/**
 * Generates purchase info from the set of participants given
 * @param rawParticipants
 * @returns {Promise<{ticketsSorted: {u5: [], adult: [], family: [], u18: []}, totalPrice: number, purchases: [], participants: *}>}
 */
async function generateQuote (rawParticipants) {
  const processedParticipants = []
  for (const rawParticipant of rawParticipants) {
    const participant = Participant.build(rawParticipant)
    await participant.validate()

    participant.age = moment(settings.bashDate).diff(participant.dob, 'years')

    processedParticipants.push(participant)
  }

  const participantsSorted = {
    u5: processedParticipants.filter(p => p.age < 5),
    u18: processedParticipants.filter(p => p.age < 18),
    adult: processedParticipants.filter(p => p.age >= 18)
  }

  const ticketsSorted = {
    u5: [],
    u18: [],
    adult: [],
    family: []
  }

  // Create family tickets.
  // any combo of 2 adults and 2 u18/u5s
  while (participantsSorted.adult.length >= 2) {
    if (participantsSorted.u5.length + participantsSorted.u18.length > 0) {
      const familyTicket = []

      for (let i = 0; i < 2; i++) {
        if (participantsSorted.u18.length > 0) { // under 18s first to provide best offer
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

  // transfer remaining participants (who did not fall into combos) into tickets
  for (const participantCategory in participantsSorted) {
    if (participantsSorted[participantCategory].length > 0) {
      ticketsSorted[participantCategory] = participantsSorted[participantCategory]
    }
  }

  // convert tickets to purchase line items
  let purchases = []
  purchases = [
    ...Object.entries(ticketsSorted).map(([ticketTypeName, tickets]) => ({
      ...purchaseTypes[ticketTypeName], // pull in name/unit price,
      quantity: tickets.length
    }))
  ]

  // handle bed and breakfast
  const participantsForBedandBreakfast = {
    adult: processedParticipants.filter(p => p.age >= 18 && p.bedAndBreakfast === true).length,
    child: processedParticipants.filter(p => p.age < 18 && p.bedAndBreakfast === true).length
  }
  purchases = [
    ...purchases,
    ...Object.entries(participantsForBedandBreakfast).map(([bnbType, quantity]) => ({
      ...purchaseTypes[bnbType + 'BnbAddon'], // pull in name/price
      quantity
    }))
  ]

  // remove purchases with 0 quantity
  purchases = purchases.filter(purchase => purchase.quantity)

  // calculate total price:
  const totalPrice = purchases.reduce((acc, purchase) => acc + (purchase.quantity * purchase.price), 0)
  return {
    totalPrice,
    ticketsSorted,
    purchases,
    participants: rawParticipants
  }
}

module.exports = generateQuote
