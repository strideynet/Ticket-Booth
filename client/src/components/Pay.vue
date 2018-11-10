<template>
  <div>
    <div id="paypal-button"></div>
    <br/>
  </div>
</template>

<script>
import paypal from 'paypal-checkout'
import { mapState } from 'vuex'
import api from '@/helpers/api'

export default {
  name: 'Pay',
  props: {
    jwt: String,
    orderInfo: Object
  },
  data () {
    return {
      paymentJWT: null
    }
  },
  computed: {
    ...mapState(['participants'])
  },
  mounted () {
    paypal.Button.render({
      env: 'sandbox',

      commit: true,

      style: {
        label: 'pay',
        size: 'responsive',
        shape: 'rect',
        color: 'blue',
        tagline: false
      },

      client: {
        sandbox: 'AbWOHwxVEl8WAQvPxGOWF4LQAbo9n-PBBg6A9RDHEwSal64k2aHbuW1vNoV0wguwkFnDcKX89ppI5vdw',
        production: '<insert production client id>'
      },

      payment: () => {
        return api.post('/payment', {
          quoteJWT: this.jwt,
          orderInfo: this.orderInfo
        }).then((res) => {
          this.paymentJWT = res.data.jwt
          return res.data.paymentID
        })
      },

      onAuthorize: (data) => {
        return api.post('/payment/execute', {
          paymentJWT: this.paymentJWT,
          payerID: data.payerID
        }).then((res) => {
          this.$router.push({ name: 'details', params: { id: res.data.id, secret: res.data.secret } })
        })
      }
    }, '#paypal-button')
  }
}
</script>
