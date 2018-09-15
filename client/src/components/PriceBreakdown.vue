<template>
  <v-flex xs12 lg4>
    <h3>Price Breakdown</h3>
    <v-divider/>

    <br/>
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
          <strong>Total Cost: £{{quote.totalPrice}}.00</strong>
        </td>
      </template>
    </v-data-table>
  </v-flex>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/helpers/api'

export default {
  name: 'PriceBreakdown',
  computed: {
    ...mapState(['participants'])
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
      }
    }
  },
  created () {
    this.$watch('participants', function (newVal, oldVal) {
      this.loading = true

      if (this.$store.getters.isParticipantsReady) {
        api.post('/api/quote', this.participants).then((res) => {
          console.log(JSON.stringify(res.data))
          this.loading = false

          this.quote = res.data
        })
      }
    }, { immediate: true, deep: true })
  }
}
</script>
