<template>
  <v-flex
    xs12
    lg4
  >
    <v-card>
      <v-card-title><h3>Price Breakdown</h3></v-card-title>
      <v-divider />
      <v-data-table
        :headers="pricingHeaders"
        :items="quote.purchases"
        hide-actions
        class="elevation-3"
        :loading="loading"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">£{{ props.item.price }}.00</td>
          <td class="text-xs-right">{{ props.item.quantity }}</td>
          <td class="text-xs-right">£{{ props.item.price * props.item.quantity }}.00</td>
        </template>
        <template slot="footer">
          <td colspan="100%">
            <br>
            <h2>Total Cost: £{{ quote.totalPrice }}.00</h2>
            <br>
            <pay
              v-if="validated && quoteJWT"
              :jwt="quoteJWT"
              :order-info="orderInfo"
            />
            <strong
              v-else
              class="red--text"
            >
              You cannot pay until you have completed the order details.
            </strong>
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
  components: { Pay },
  props: {
    validated: Boolean,
    orderInfo: {
      type: Object,
      default: () => ({})
    }
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
  computed: {
    ...mapState('store', ['participants'])
  },
  created () {
    this.$watch('participants', function (newVal, oldVal) {
      if (this.$store.getters['store/isParticipantsReady']) {
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
