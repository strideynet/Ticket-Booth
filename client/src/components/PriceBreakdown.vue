<template>
  <v-flex xs12 lg4>
    <h3>Price Breakdown</h3>
    <v-divider/>

    <br/>
    <v-data-table
      :headers="pricingHeaders"
      :items="quote.items"
      hide-actions
      class="elevation-3"
      :loading="loading"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.first }} {{ props.item.last }}</td>
        <td>{{ props.item.nick }}</td>
        <td>{{ props.item.dob }}</td>
        <td></td>
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
        items: []
      }
    }
  },
  created () {
    this.$watch('participants', function (newVal, oldVal) {
      this.loading = true
      api.post('/api/quote', this.participants).then((res) => {
        this.loading = false

        this.quote = res.data
      })
    }, { immediate: true, deep: true })
  }
}
</script>
