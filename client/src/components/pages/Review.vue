<template>
  <div>
      <h1>Review Order</h1>

      <v-layout wrap>
        <v-flex xs12 lg8>
          <h3>Order Details</h3>
          <v-divider/>
              How many years at bash??

              Party name.
          <br/>

          <br/>
          <h3>Participants</h3>

          <v-divider/>
          <br/>
          <v-data-table
            :headers="headers.participants"
            :items="participants"
            hide-actions
            class="elevation-3"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.first }} {{ props.item.last }}</td>
              <td>{{ props.item.nick }}</td>
              <td>{{ props.item.dob }}</td>
              <td>{{ age(props.item.dob) }}</td>
            </template>
          </v-data-table>
        </v-flex>
        <price-breakdown></price-breakdown>
      </v-layout>
      <v-btn color="secondary"
      @click='$store.state.participantsComplete = false'
      >
        <v-icon dark left>chevron_left</v-icon>
        Go Back
      </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import PriceBreakdown from '../PriceBreakdown'

export default {
  name: 'Review',
  components: {
    'PriceBreakdown': PriceBreakdown
  },
  computed: {
    ...mapState(['participants'])
  },
  data () {
    return {
      headers: {
        participants: [
          {
            text: 'Name',
            sortable: false
          },
          {
            text: 'Plate Title',
            sortable: false
          },
          {
            text: 'DoB',
            sortable: false
          },
          {
            text: 'Age At Bash',
            sortable: false
          }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    age (dob) {
      return moment(this.$store.state.settings.bashDate).diff(dob, 'years')
    }
  }
}
</script>
