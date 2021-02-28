<template>
  <v-container grid-list-md>
    <h1>
      Orders
    </h1>
    <br>
    <v-card>
      <v-card-title>
        <h3>
          All Orders
        </h3>
        <v-spacer />
        <v-text-field
          v-model="searchQuery"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
        <v-btn
          color="primary"
          @click="newOrder"
        >
          New Order
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="orders"
        :search="searchQuery"
        :custom-filter="search"
        :pagination.sync="pagination"
        disable-initial-sort
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <tr
            style="cursor:pointer"
            @click="$router.push('/admin/orders/' + props.item.id)"
          >
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.status }}</td>
            <td>{{ props.item.type }}</td>
            <td>{{ props.item.createdAt | dateTime }}</td>
            <td>{{ props.item.partyName }}</td>
            <td>£{{ props.item.value }}</td>
            <td>{{ props.item.email }}</td>
            <td>{{ props.item.yearsAtTheBash }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="showModal"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">
            <strong>
              CREATE ORDER
            </strong>
          </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md4>
                <v-text-field
                  v-model="modalForm.partyName"
                  label="Party Name"
                />
              </v-flex>
              <v-flex md4>
                <v-text-field
                  v-model="modalForm.yearsAtTheBash"
                  label="Years At Bash"
                />
              </v-flex>
              <v-flex md4>
                <v-text-field
                  v-model="modalForm.value"
                  label="Order Value"
                />
              </v-flex>
              <v-flex md12>
                <v-text-field
                  v-model="modalForm.email"
                  label="Party Email"
                />
              </v-flex>
              <v-flex md12>
                <v-textarea
                  v-model="modalForm.note"
                  label="Order Note"
                  hint="This could be customer facing. Be careful what you say :)"
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
            @click="saveOrder"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Fuse from 'fuse.js'
import Moment from 'moment'

export default {
  name: 'AdminOrders',
  filters: {
    dateTime (value) {
      let date = new Moment(value)

      return date.format('DD/MM/YYYY HH:mm:ss')
    }
  },
  data () {
    return {
      searchQuery: '',
      headers: [
        {
          value: 'id',
          text: 'Unique ID'
        },
        {
          value: 'status',
          text: 'Status'
        },
        {
          value: 'type',
          text: 'Type'
        },
        {
          value: 'createdAt',
          text: 'Order Time'
        },
        {
          value: 'partyName',
          text: 'Party Name'
        },
        {
          value: 'value',
          text: 'Value'
        },
        {
          value: 'email',
          text: 'Email'
        },
        {
          value: 'yearsAtTheBash',
          text: 'Years at Bash'
        }
      ],
      showModal: false,
      modalLoading: false,
      modalForm: {
        partyName: 'The Smiths',
        value: 0,
        email: 'john@thesmiths.com',
        yearsAtTheBash: -1,
        note: ''
      },
      pagination: {
        rowsPerPage: 20
      }
    }
  },
  computed: {
    ...mapState('admin', {
      orders: state => state.orders
    })
  },
  methods: {
    search (items, search) {
      if (search === '') {
        return items
      }

      const fuse = new Fuse(items, {
        shouldSort: true,
        keys: ['email', 'partyName'],
        maxPatternLength: 12
      })

      return fuse.search(search)
    },
    newOrder () {
      this.showModal = true
    },
    async saveOrder () {
      this.modalLoading = true
      const newOrder = await this.$store.dispatch('admin/postOrder', this.modalForm)
      this.modalLoading = false
      this.$router.push(`/admin/orders/${newOrder.id}`)
    }
  }
}
</script>
