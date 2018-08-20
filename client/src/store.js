import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tcsAccepted: false,
    participantsComplete: false,
    participants: [{}]
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
