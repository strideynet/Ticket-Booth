import Vue from 'vue'
import Vuex from 'vuex'

import admin from '@/modules/admin'
import store from '@/modules/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    admin,
    store
  }
})
