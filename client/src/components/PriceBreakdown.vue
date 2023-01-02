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
        :loading="loading"
        hide-actions
        class="elevation-3"
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

            <strong
              v-if="!validated || !quoteJWT"
              class="red--text"
            >
              You cannot pay until you have completed the order details.
            </strong>
            <strong
              v-else-if="missingAdult"
              class="red--text"
            >
              Tickets for Under 18s cannot be purchased without an accompanying adult.
            </strong>
            <pay
              v-else
              :jwt="quoteJWT"
              :order-info="orderInfo"
            />
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
    ...mapState('store', ['participants']),
    missingAdult() {
      let adult = false
      let child = false
      for (const p of this.participants) {
        const age = moment(this.$store.state.store.settings.bashDate).diff(p.dob, 'years')
        if (age < 18) {
          child = true
        } else {
          adult = true
        }
      }

      return child && !adult
    }
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
