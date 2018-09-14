<template>
  <div>
      <h1>Review Order</h1>

      <v-layout wrap>
        <v-flex xs12 lg8>
          <v-card dark>
            <v-card-title primary-title>
                <h3>Order Details</h3>
            </v-card-title>

            <v-divider/>
            <v-card-text>
              How many years at bash??

              Party name.
            </v-card-text>
          </v-card>
          <br/>
          <v-card dark>
            <v-card-title primary-title>
                <h3>Participants</h3>
            </v-card-title>

            <v-divider/>
            <v-card-text>
              <v-data-table
                :headers="headers.participants"
                :items="participants"
                hide-actions
                class="elevation-1"
                light
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.first }} {{ props.item.last }}</td>
                  <td>{{ props.item.nick }}</td>
                  <td>{{ props.item.dob }}</td>
                  <td>{{ age(props.item.dob) }}</td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 lg4>
          <v-card dark>
            <v-card-title primary-title>
                <h3>Price Breakdown</h3>
            </v-card-title>

            <v-divider/>
            <v-card-text>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-btn color="warning"
      @click='$store.state.participantsComplete = false'
      >
        Go Back
        <v-icon dark right>backspace</v-icon>
      </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'Review',
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
