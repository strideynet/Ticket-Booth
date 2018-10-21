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
    jwt: String
  },
  computed: {
    ...mapState(['participants'])
  },
  mounted () {
    paypal.Button.render({

      // Set your environment

      env: 'sandbox', // sandbox | production

      // Specify the style of the button

      commit: true,

      style: {
        label: 'pay',
        size:  'responsive',    // small | medium | large | responsive
        shape: 'rect',     // pill | rect
        color: 'blue',     // gold | blue | silver | black
        tagline: false
      },

      // PayPal Client IDs - replace with your own
      // Create a PayPal app: https://developer.paypal.com/developer/applications/create

      client: {
        sandbox:    'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
        production: '<insert production client id>'
      },

      payment: () => {
        return api.post('/payment', {
          quoteJWT: this.jwt
        }).then((res) => {
          console.log(res.data.jwt)

          return res.data.paymentID
        })
      },

      onAuthorize: () => {
        return api.post('/payment/execute')
          .then((res) => {
            //redirect to complete payment page
          })
      }
    }, '#paypal-button')
  }
}
</script>
