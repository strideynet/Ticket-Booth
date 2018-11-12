<template>
  <v-flex xs12 lg4>
    <v-card>
      <v-card-title><h3>Terms and Conditions</h3></v-card-title>
      <v-divider/>
      <v-data-table
        :headers="pricingHeaders"
        :items="quote.purchases"
        hide-actions
        class="elevation-3"
        :loading="loading"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.price }}</td>
          <td>{{ props.item.count }}</td>
          <td>{{ props.item.totalPrice }}</td>
        </template>
        <template slot="footer">
          <td colspan="100%">
            <br/>
            <h2>Total Cost: £{{quote.totalPrice}}.00</h2>
            <br/>
            <pay v-if="validated && quoteJWT" :jwt="quoteJWT" :order-info="orderInfo"></pay>
            <strong v-else class="red--text">You cannot pay until you have completed the order details.</strong>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/helpers/api'
import Pay from '@/components/Pay.vue'

export default {
  name: 'PriceBreakdown',
  computed: {
    ...mapState(['participants'])
  },
  components: { Pay },
  props: {
    validated: Boolean,
    orderInfo: Object
  },
  data () {
    return {
      loading: true,
      pricingHeaders: [
        {
          text: 'Ticket',
          sortable: false
        },
        {
          text: 'Price',
          sortable: false
        },
        {
          text: 'Amount',
          sortable: false
        },
        {
          text: 'Total',
          sortable: false
        }
      ],
      quote: {
        purchases: [],
        totalPrice: 0
      },
      quoteJWT: null
    }
  },
  created () {
    this.$watch('participants', function (newVal, oldVal) {
      if (this.$store.getters.isParticipantsReady) {
        this.loading = true
        api.post('/quotes', this.participants).then((res) => {
          this.loading = false
          console.log(res.data)
          this.quote = res.data.quote
          this.quoteJWT = res.data.jwt
        })
      }
    }, { immediate: true, deep: true })
  }
}
</script>
