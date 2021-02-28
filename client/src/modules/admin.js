import api from '@/helpers/api'

export default {
  name: 'admin',
  namespaced: true,
  state: {
    orders: [],
    participants: [],
    users: [],
    loading: [],
    jwt: null
  },
  mutations: {
    setOrders: (state, orders) => {
      state.orders = orders
    },
    addOrder: (state, order) => {
      state.orders = [
        ...state.orders,
        order
      ]
    },
    updateOrder: (state, order) => {
      state.orders = [
        ...state.orders.filter(val => val.id !== order.id),
        order
      ]
    },
    setParticipants: (state, participants) => {
      state.participants = participants
    },
    deleteParticipant: (state, participant) => {
      state.participants = state.participants.filter(val => val.id !== participant.id)
    },
    updateParticipant: (state, participant) => {
      state.participants = [
        ...state.participants.filter(val => val.id !== participant.id),
        participant
      ]
    },
    addParticipant: (state, participant) => {
      state.participants = [
        ...state.participants,
        participant
      ]
    },
    setUsers: (state, users) => {
      state.users = users
    },
    setJWT: (state, jwt) => {
      state.jwt = jwt
    },
    startLoading: (state, loader) => {
      const index = state.loading.indexOf(loader)

      if (index === -1) {
        state.loading.push(loader)
      }
    },
    stopLoading: (state, loader) => {
      const index = state.loading.indexOf(loader)

      if (index > -1) {
        state.loading.splice(index, 1)
      }
    }
  },
  actions: {
    login: async ({ commit }, auth) => {
      const res = await api.post('/auth', auth)

      commit('setJWT', res.data.token)
    },
    fetchOrders: async ({ commit }) => {
      commit('startLoading', 'fetch orders')

      const res = await api.get('/orders')

      commit('setOrders', res.data)
      commit('stopLoading', 'fetch orders')
    },
    fetchParticipants: async ({ commit }) => {
      commit('startLoading', 'fetch participants')

      const res = await api.get('/participants')

      commit('setParticipants', res.data)
      commit('stopLoading', 'fetch participants')
    },
    deleteParticipant: async ({ commit }, participant) => {
      await api.delete(`/participants/${participant.id}`)
      commit('deleteParticipant', participant)
    },
    patchParticipant: async ({ commit }, participant) => {
      const res = await api.patch(`/participants/${participant.id}`, participant)
      commit('updateParticipant', res.data)
    },
    postParticipant: async ({ commit }, participant) => {
      const res = await api.post(`/participants`, participant)
      commit('addParticipant', res.data)
    },
    postOrder: async ({ commit }, order) => {
      const res = await api.post(`/orders`, order)
      commit('addOrder', res.data)

      return res.data
    },
    patchOrder: async ({ commit }, order) => {
      const res = await api.patch(`/orders/${order.id}`, order)
      commit('updateOrder', res.data)
    },
    fetchAllData: ({ dispatch }) => {
      return Promise.all([dispatch('fetchOrders'), dispatch('fetchParticipants')])
    }
  },
  getters: {
    isAnythingLoading: state => state.loading.length > 0
  }
}
