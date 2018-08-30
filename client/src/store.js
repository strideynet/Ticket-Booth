import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tcsAccepted: false,
    participantsComplete: false,
    participants: [],
    settings: {
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
