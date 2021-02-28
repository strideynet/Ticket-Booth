<template>
  <div>
    <h1>Review Order</h1>
    <v-layout
      wrap
      row
    >
      <v-flex
        xs12
        lg8
      >
        <v-layout
          wrap
          row
        >
          <v-flex xs12>
            <v-card>
              <v-card-title><h4>Order Details</h4></v-card-title>
              <v-divider />
              <v-card-text>
                <v-form>
                  <v-layout>
                    <v-flex
                      xs12
                      lg6
                    >
                      <v-text-field
                        v-model="orderInfo.partyName"
                        label="Party Name"
                        placeholder="Your Party Name"
                        :error-messages="$v.orderInfo.partyName.$invalid ? 'This field is required' : null"
                      />
                      <p class="caption">
                        You will need to quote this when you arrive for registration at the bash! Your surname would work nicely.
                      </p>
                      <v-text-field
                        v-model="orderInfo.email"
                        label="Email Address"
                        type="email"
                        placeholder="Your Email Address"
                        :error-messages="$v.orderInfo.email.$invalid ? 'This field is required' : null"
                      />
                      <p class="caption">
                        Please make sure this is right, or we won't be able to email you your ticket details!
                      </p>
                      <v-select
                        v-model="orderInfo.yearsAtTheBash"
                        label="Previous Years at the Bash"
                        :items="bashYearsDropDown"
                      />
                      <p class="caption">
                        This won't affect your order but helps us understand more about who attends.
                      </p>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card>
              <v-card-title><h4>Participants</h4></v-card-title>
              <v-divider />
              <v-data-table
                :headers="headers.participants"
                :items="participants"
                hide-actions
              >
                <template
                  slot="items"
                  slot-scope="props"
                >
                  <td>{{ props.item.first }} {{ props.item.last }}</td>
                  <td>{{ props.item.nick }}</td>
                  <td>{{ props.item.dob }}</td>
                  <td>{{ age(props.item.dob) }}</td>
                  <td>{{ props.item.bedAndBreakfast ? 'Yes' : 'No' }}</td>
                </template>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <price-breakdown
        :validated="!$v.orderInfo.$invalid"
        :order-info="orderInfo"
      />
    </v-layout>
    <v-btn
      color="secondary"
      to="/store/order/participants"
    >
      <v-icon
        dark
        left
      >
        chevron_left
      </v-icon>
      Go Back
    </v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import PriceBreakdown from '@/components/PriceBreakdown'
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
          },
          {
            text: 'Bed and Breakfast',
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
  computed: {
    ...mapState('store', ['participants'])
  },
  methods: {
    age (dob) {
      return moment(this.$store.state.store.settings.bashDate).diff(dob, 'years')
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
