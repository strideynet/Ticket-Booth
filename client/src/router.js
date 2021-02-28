import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'

const StoreFrame = () => import('@/components/StoreFrame.vue')

const Home = () => import('@/views/Home.vue')
const OrderDetails = () => import('@/views/OrderDetails.vue')

const TermsConditions = () => import('@/views/TermsConditions')
const Participants = () => import('@/views/Participants')
const Review = () => import('@/views/Review')

const Login = () => import('@/views/Login')

const AdminFrame = () => import('@/components/AdminFrame')
const AdminDashboard = () => import('@/views/admin/Dashboard')
const AdminOrders = () => import('@/views/admin/Orders')
const AdminParticipants = () => import('@/views/admin/Participants')
const AdminOrderDetails = () => import('@/views/admin/OrderDetails')

Vue.use(Router)

const authGuard = (to, from, next) => {
  if (!store.state.admin.jwt) {
    next('/login')
  }
  next()
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/store'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/admin',
      component: AdminFrame,
      children: [
        {
          path: '/',
          redirect: '/admin/dash'
        },
        {
          path: 'dash',
          beforeEnter: authGuard,
          component: AdminDashboard
        },
        {
          path: 'orders',
          beforeEnter: authGuard,
          component: AdminOrders
        },
        {
          path: 'participants',
          beforeEnter: authGuard,
          component: AdminParticipants
        },
        {
          path: 'orders/:id',
          beforeEnter: authGuard,
          component: AdminOrderDetails
        }
      ]
    },
    {
      path: '/store',
      component: StoreFrame,
      children: [
        {
          path: '/',
          component: Home
        },
        {
          path: 'order/tc',
          name: 'order-tc',
          component: TermsConditions,
          beforeEnter: (to, from, next) => {
            if (!store.getters['store/isPurchaseAllowed']) {
              return next('/store')
            }

            next()
          }
        },
        {
          path: 'order/participants',
          name: 'order-participants',
          component: Participants,
          beforeEnter: (to, from, next) => {
            if (!store.getters['store/isPurchaseAllowed']) {
              return next('/store')
            }

            if (!store.state.store.tcsAccepted) {
              return next('/store/order/tc')
            }

            next()
          }
        },
        {
          path: 'order/review',
          name: 'order-review',
          component: Review,
          beforeEnter: (to, from, next) => {
            if (!store.getters['store/isPurchaseAllowed']) {
              return next('/')
            }

            if (!store.state.store.tcsAccepted) {
              return next('/store/order/tc')
            }

            if (!store.state.store.participantsComplete) {
              return next('/store/order/participants')
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
    }
  ]
})
