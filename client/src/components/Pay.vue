<template>
  <div>
    <div id="paypal-button" />
    <br>
  </div>
</template>

<script>
import paypal from 'paypal-checkout'
import { mapState } from 'vuex'
import api from '@/helpers/api'

export default {
  name: 'Pay',
  props: {
    jwt: {
      type: String,
      default: null
    },
    orderInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      paymentJWT: null
    }
  },
  computed: {
    ...mapState('store', ['participants'])
  },
  mounted () {
    paypal.Button.render({
      env: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',

      commit: true,

      style: {
        label: 'pay',
        size: 'responsive',
        shape: 'rect',
        color: 'blue',
        tagline: false
      },

      client: {
        sandbox: 'AbSd1YdB-bEO1fAbtUfBDzk-KHIGlIiqQhdzYRW73HsI7dksPlFuMW_PMLPfl0xl4tVbruAkE8FQjUto',
        production: 'AT99udy6QwHym74yFhgilqEVyiAu42cFGvP24hhIZf10h0-fiEAEW8POLV5530OVSBtHb2OJmrRmw2_2'
      },

      payment: () => {
        return api.post('/payment', {
          quoteJWT: this.jwt,
          orderInfo: this.orderInfo
        }).then((res) => {
          this.paymentJWT = res.data.jwt
          return res.data.paymentId
        })
      },

      onAuthorize: (data) => {
        return api.post('/payment/execute', {
          paymentJWT: this.paymentJWT,
          payerId: data.payerID
        }).then((res) => {
          this.$router.push({ name: 'details', params: { id: res.data.id, secret: res.data.secret } })
        })
      }
    }, '#paypal-button')
  }
}
</script>
