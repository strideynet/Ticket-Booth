<template>
  <div>
    <h1>Order Receipt</h1>
    <v-divider />

    <v-layout
      v-if="loading"
      align-center
      justify-center
    >
      <v-flex
        xs1
        class="text-xs-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
        <br>
        Loading...
      </v-flex>
    </v-layout>
    <v-layout
      v-else
      wrap
    >
      <v-flex
        xs12
        lg4
      >
        <v-card>
          <v-card-title><h4>Order</h4></v-card-title>
          <v-divider />
          <v-list dense>
            <v-list-tile>
              <p><strong>Email:</strong> {{ details.email }}</p>
            </v-list-tile>
            <v-list-tile>
              <p><strong>Ticket Number:</strong> {{ details.id }}</p>
            </v-list-tile>
            <v-list-tile>
              <p><strong>Paypal ID:</strong> {{ details.paypalPayment }}</p>
            </v-list-tile>
            <v-list-tile>
              <p><strong>Ticket Value:</strong> £{{ details.value }}</p>
            </v-list-tile>
            <v-list-tile>
              <p><strong>Party Name:</strong> {{ details.partyName }}</p>
            </v-list-tile>
            <v-list-tile>
              <p><strong>Order Date&Time:</strong> {{ details.createdAt | dateTime }}</p>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        lg8
      >
        <v-card>
          <v-card-title><h4>Participants</h4></v-card-title>
          <v-divider />
          <v-data-table
            :items="details.participants"
            :headers="headers"
            hide-actions
          >
            <template
              slot="items"
              slot-scope="props"
            >
              <td>
                {{ props.item.id }}
              </td>
              <td>
                {{ props.item.first }} {{ props.item.last }}
              </td>
              <td>
                {{ props.item.dob | date }}
              </td>
              <td>
                {{ props.item.nick }}
              </td>
              <td>
                {{ props.item.mobile || 'None specified' }}
              </td>
              <td>
                {{ props.item.gender }}
              </td>
              <td>
                {{ props.item.bedAndBreakfast ? 'Yes' : 'No' }}
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import api from '@/helpers/api'
import Moment from 'moment'

export default {
  name: 'OrderDetails',
  filters: {
    date (value) {
      let date = new Moment(value)

      return date.format('DD/MM/YYYY')
    },
    dateTime (value) {
      let date = new Moment(value)

      return date.format('DD/MM/YYYY HH:mm:ss')
    }
  },
  data () {
    return {
      loading: true,
      details: {
        participants: []
      },
      headers: [
        {
          text: 'ID',
          value: 'id',
          sortable: false
        },
        {
          text: 'Name',
          value: 'first',
          sortable: false
        },
        {
          text: 'Date of Birth',
          value: 'dob',
          sortable: false
        },
        {
          text: 'Nickname',
          value: 'nick',
          sortable: false
        },
        {
          text: 'Mobile',
          value: 'mobile',
          sortable: false
        },
        {
          text: 'Gender',
          value: 'gender',
          sortable: false
        },
        {
          text: 'Bed and Breakfast',
          sortable: false
        }
      ]
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.loading = true
      const res = await api.get(`/orders/${this.$route.params.id}/${this.$route.params.secret}`, this.participants)
      this.loading = false

      this.details = res.data
    }
  }
}
</script>
