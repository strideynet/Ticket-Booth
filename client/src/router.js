import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import OrderDetails from './views/OrderDetails.vue'

import TermsConditions from './views/TermsConditions'
import Participants from './views/Participants'
import Review from './views/Review'

import store from './store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/order/tc',
      name: 'order-tc',
      component: TermsConditions,
      beforeEnter: (to, from, next) => {
        if (!store.getters.isPurchaseAllowed) {
          return next('/')
        }

        next()
      }
    },
    {
      path: '/order/participants',
      name: 'order-participants',
      component: Participants,
      beforeEnter: (to, from, next) => {
        if (!store.getters.isPurchaseAllowed) {
          return next('/')
        }

        if (!store.state.tcsAccepted) {
          return next('/order/tc')
        }

        next()
      }
    },
    {
      path: '/order/review',
      name: 'order-review',
      component: Review,
      beforeEnter: (to, from, next) => {
        if (!store.getters.isPurchaseAllowed) {
          return next('/')
        }

        if (!store.state.tcsAccepted) {
          return next('/order/tc')
        }

        if (!store.state.participantsComplete) {
          return next('/order/participants')
        }

        next()
      }
    },
    {
      path: '/details/:id/:secret',
      name: 'details',
      component: OrderDetails
    }
  ]
})
