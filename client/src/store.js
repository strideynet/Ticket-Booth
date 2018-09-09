import Vue from 'vue'
import Vuex from 'vuex'
import api from './helpers/api'

Vue.use(Vuex)

function isParticipantsReady (state) {
  if (state.participants.length > 0) {
    return state.participants.every((participant) => !participant.invalid)
  }

  return false
}

export default new Vuex.Store({
  state: {
    tcsAccepted: false,
    participantsComplete: false,
    participants: [],
    settings: {}
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
      state.participants.push({
        first: 'John',
        last: 'Smith',
        nick: 'Smithy',
        dob: null,
        mobile: null,
        invalid: true
      })
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
    }
  },
  actions: {
    updateSettings: context => {
      api.get('/api/settings').then(response => {
        context.commit('updateSettings', response.data)
      }).catch(err => {
        console.log('implement handler', err)
      })
    }
  },
  getters: {
    currentStep: state => {
      if (state.tcsAccepted === false) {
        return 1
      } else if (state.participantsComplete === false) {
        return 2
      } else {
        return 3
      }
    },
    isParticipantsReady
  }
})
