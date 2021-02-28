import api from '../helpers/api'
import Moment from 'moment'
import { newParticipant } from '../helpers/constants'

const isParticipantsReady = (state) => {
  if (state.participants.length > 0) {
    return state.participants.every((participant) => !participant.invalid)
  }

  return false
}

export default {
  name: 'store',
  namespaced: true,
  state: {
    tcsAccepted: false,
    participantsComplete: false,
    participants: [],
    settings: {},
    overrideCode: null
  },
  mutations: {
    acceptTerms: state => {
      state.tcsAccepted = true
    },
    finishParticipants: state => {
      if (isParticipantsReady(state)) {
        state.participantsComplete = true
      }
    },
    addParticipant: state => {
      state.participants.push(Object.assign({}, {
        ...newParticipant,
        invalid: true
      }))
    },
    deleteParticipant: (state, participant) => {
      let index = state.participants.indexOf(participant)

      if (index !== -1) state.participants.splice(index, 1)
    },
    updateParticipant: (state, payload) => {
      let index = state.participants.indexOf(payload.participant)

      if (index !== -1) {
        state.participants[index][payload.key] = payload.value
      }
    },
    updateSettings: (state, newSettings) => {
      state.settings = {
        ...state.settings,
        ...newSettings
      }
    },
    setOverride: (state, code) => {
      state.overrideCode = code
    }
  },
  actions: {
    updateSettings: context => {
      api.get('/settings').then(response => {
        context.commit('updateSettings', response.data)
      }).catch(err => {
        console.log('implement handler', err)
      })
    }
  },
  getters: {
    isParticipantsReady,
    isSalesOpen: (state) => {
      if (!state.settings.salesOpen) return false

      const now = new Moment()

      return now.isAfter(state.settings.salesOpen)
    },
    isTicketsLeft: (state) => {
      return state.settings.maxParticipants > state.settings.currentParticipants
    },
    isPurchaseAllowed: (state, getters) => {
      if (!getters.isTicketsLeft) {
        return false
      }

      if (!getters.isSalesOpen && state.overrideCode !== 'danlikesbeer') {
        return false
      }

      return true
    }
  }
}
