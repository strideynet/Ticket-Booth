import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tcsAccepted: false,
    participantsComplete: false,
    participants: [],
    settings: {
      maxParticipants: 800,
      currentParticipants: 10,
      salesOpen: Date.now(),
      bashDate: '2019-08-23',
      ticketTypes: {
        u5: {
          price: 0.01,
          priority: 3,
          criteria: {
            age: {
              condition: 'lt',
              value: 5
            }
          }
        },
        u18: {
          price: 100,
          priority: 2,
          criteria: {
            age: {
              condition: 'lt',
              value: 18
            }
          }
        },
        adult: {
          price: 200,
          priority: 1,
          criteria: {
            age: {
              condition: 'gt',
              value: 18
            }
          }
        }
      }
    }
  },
  mutations: {
    acceptTerms: state => {
      state.tcsAccepted = true
    },
    finishParticipants: state => {
      if (state.participants.length > 0) {
        state.participantsComplete = true
      }
    },
    addParticipant: state => {
      state.participants.push({
        first: 'John',
        last: 'Smith',
        nick: 'Smithy',
        dob: null,
        mobile: null
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
    }
  },
  actions: {

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
    }
  }
})
