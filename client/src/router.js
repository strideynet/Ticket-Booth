import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Order from './views/Order.vue'
import OrderDetails from './views/OrderDetails.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: '/details/:id/:secret',
      name: 'details',
      component: OrderDetails
    }
  ]
})
