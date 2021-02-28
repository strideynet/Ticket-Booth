<template>
  <v-container grid-list-md>
    <h1>Order Details</h1>
    <br>

    <v-layout
      v-if="order"
      wrap
    >
      <v-flex
        xs12
        lg4
      >
        <v-card>
          <v-card-title>
            <h4><strong>{{ order.status }}</strong> Order</h4>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-layout wrap>
              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.partyName"
                  label="Party Name"
                />
              </v-flex>
              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.email"
                  label="Party Email"
                />
              </v-flex>
              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.value"
                  label="Order Value"
                />
              </v-flex>

              <v-flex md12>
                <v-textarea
                  v-model="modifiedOrder.note"
                  label="Order Note"
                />
              </v-flex>

              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.id"
                  label="Ticket Number"
                  disabled
                />
              </v-flex>

              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.paypalPayment"
                  label="Paypal ID"
                  disabled
                />
              </v-flex>

              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.createdAt"
                  label="Created At:"
                  disabled
                />
              </v-flex>

              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.status"
                  label="Status"
                  disabled
                />
              </v-flex>

              <v-flex md12>
                <v-text-field
                  v-model="modifiedOrder.type"
                  label="Type"
                  disabled
                />
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="order.status === 'CONFIRMED'"
              color="red"
              :loading="statusUpdateLoading"
              @click="changeStatus('CANCELLED')"
            >
              Mark Cancelled
            </v-btn>
            <v-btn
              v-if="order.status === 'CANCELLED'"
              color="green"
              :loading="statusUpdateLoading"
              @click="changeStatus('CONFIRMED')"
            >
              Mark Confirmed
            </v-btn>
            <v-btn
              color="blue darken-1"
              :disabled="!isDirtied || orderDetailsLoading"
              :loading="orderDetailsLoading"
              @click="patchOrder"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        lg8
      >
        <v-card>
          <v-card-title>
            <h4>Participants</h4>
            <v-spacer />
            <v-btn
              color="primary"
              @click="newParticipant"
            >
              New Participant
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-data-table
            :items="participants"
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
              <td>
                <v-icon
                  class="mr-2"
                  @click="modifyParticipant(props.item)"
                >
                  edit
                </v-icon>
                <v-icon
                  @click="deleteParticipant(props.item)"
                >
                  delete
                </v-icon>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <h3 v-else>
      No order found
    </h3>
    <v-dialog
      v-model="showModal"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">
            <strong>
              {{ modalMode === 'create' ? 'CREATE' : 'EDIT' }}
            </strong>
            {{ modifiedParticipant.first }} "{{ modifiedParticipant.nick }}" {{ modifiedParticipant.last }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md4>
                <v-text-field
                  v-model="modifiedParticipant.first"
                  label="First Name"
                />
              </v-flex>
              <v-flex md4>
                <v-text-field
                  v-model="modifiedParticipant.last"
                  label="Last Name"
                />
              </v-flex>
              <v-flex md4>
                <v-text-field
                  v-model="modifiedParticipant.nick"
                  label="Nick Name"
                />
              </v-flex>

              <v-flex md6>
                <v-select
                  v-model="modifiedParticipant.gender"
                  :items="genderOptions"
                  label="Gender"
                />
              </v-flex>

              <v-flex md6>
                <v-text-field
                  v-model="modifiedParticipant.mobile"
                  label="Mobile Number"
                />
              </v-flex>

              <v-flex md12>
                <v-checkbox
                  v-model="modifiedParticipant.bedAndBreakfast"
                  label="Bed and Breakfast"
                />
              </v-flex>

              <v-flex md12>
                <v-text-field
                  slot="activator"
                  v-model="modifiedParticipant.dob"
                  label="Birth date"
                  prepend-icon="event"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            flat
            @click="showModal = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            flat
            :loading="modalLoading"
            @click="saveParticipant"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Moment from 'moment'
import { genderOptions, newParticipant } from '@/helpers/constants'
import _ from 'lodash'

export default {
  name: 'AdminOrderDetails',
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
        },
        {
          text: 'Actions',
          value: 'id',
          sortable: false
        }
      ],
      showModal: false,
      dateSelector: false,
      modalMode: 'create',
      modalLoading: false,
      statusUpdateLoading: false,
      orderDetailsLoading: false,
      modifiedParticipant: {
      },
      modifiedOrder: {
      },
      genderOptions
    }
  },
  computed: {
    order () {
      return this.$store.state.admin.orders.find(order => order.id === this.$route.params.id)
    },
    participants () {
      return this.$store.state.admin.participants.filter(participant => participant.orderId === this.$route.params.id)
    },
    isDirtied () {
      return !_.isEqual(this.modifiedOrder, this.order)
    }
  },
  watch: {
    order: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.modifiedOrder = Object.assign({}, val)
      }
    }
  },
  methods: {
    saveDate (date) {
      this.$refs.dateSelector.save(date)
    },
    deleteParticipant (participant) {
      if (confirm('Are you sure you want to delete this participant?')) {
        this.$store.dispatch('admin/deleteParticipant', participant)
      }
    },
    /**
     * Creates modal dialogue for modifying participant
     * @param participant
     */
    modifyParticipant (participant) {
      this.modifiedParticipant = Object.assign({}, participant)
      this.modalMode = 'modify'

      this.showModal = true
    },
    newParticipant () {
      this.modifiedParticipant = Object.assign({}, {
        ...newParticipant,
        dob: '2017-05-20T00:00:00.000Z',
        orderId: this.$route.params.id
      })
      this.modalMode = 'create'

      this.showModal = true
    },
    async saveParticipant () {
      const action = this.modalMode === 'create' ? 'admin/postParticipant' : 'admin/patchParticipant'
      this.modalLoading = true
      await this.$store.dispatch(action, this.modifiedParticipant)
      this.modalLoading = false
      this.showModal = false
    },
    async changeStatus (newStatus) {
      this.statusUpdateLoading = true
      await this.$store.dispatch('admin/patchOrder', {
        id: this.order.id,
        status: newStatus
      })
      this.statusUpdateLoading = false
    },
    async patchOrder () {
      this.orderDetailsLoading = true
      await this.$store.dispatch('admin/patchOrder', this.modifiedOrder)
      this.orderDetailsLoading = false
    }
  }
}
</script>
