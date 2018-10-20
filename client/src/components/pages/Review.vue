<template>
  <div>
      <h1>Review Order</h1>
      <v-layout wrap>
        <v-flex xs12 lg8>
          <h3>Order Details</h3>
          <v-divider/>
          <v-form>
            <v-layout>
              <v-flex xs12 lg6>
                <v-text-field
                  label="Party Name"
                  placeholder="Placeholder"
                  v-model="orderInfo.partyName"
                  :error-messages="$v.orderInfo.partyName.$invalid ? 'This field is required' : null"
                ></v-text-field>
                <p class="caption">You will need to quote this when you arrive for registration at the bash!</p>
                <v-text-field
                  label="Email Address"
                  placeholder="Placeholder"
                  v-model="orderInfo.email"
                  :error-messages="$v.orderInfo.email.$invalid ? 'This field is required' : null"
                ></v-text-field>
                <p class="caption">Please make sure this is right, or we won't be able to email you your ticket details!</p>
                <v-select
                  label="Previous Years at the Bash"
                  v-model="orderInfo.yearsAtTheBash"
                  :items="bashYearsDropDown"
                ></v-select>
                <p class="caption">This won't affect your order but helps us understand more about who attends.</p>
              </v-flex>
            </v-layout>
          </v-form>
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
        <price-breakdown :validated="!$v.orderInfo.$invalid"></price-breakdown>
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
import { required } from 'vuelidate/lib/validators'

const bashYearsDropDown = [{ text: 'Not Selected', value: -1 }]
for (let i = 0; i < 12; i++) {
  bashYearsDropDown.push({
    text: i,
    value: i
  })
}
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
      },
      bashYearsDropDown,
      orderInfo: {
        partyName: null,
        email: null,
        yearsAtTheBash: -1
      }
    }
  },
  mounted () {
  },
  methods: {
    age (dob) {
      return moment(this.$store.state.settings.bashDate).diff(dob, 'years')
    }
  },
  validations: {
    orderInfo: {
      partyName: {
        required
      },
      email: {
        required
      }
    }
  }
}
</script>
