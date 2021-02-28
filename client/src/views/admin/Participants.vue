<template>
  <v-container grid-list-md>
    <h1>
      Participants
    </h1>
    <br>
    <v-card>
      <v-card-title>
        <h3>
          All Participants
        </h3>
        <v-spacer />
        <v-text-field
          v-model="searchQuery"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="participants"
        :search="searchQuery"
        :custom-filter="search"
        :pagination.sync="pagination"
        disable-initial-sort
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.order.status }}</td>
          <td
            style="cursor: pointer"
            @click="$router.push('/admin/orders/' + props.item.orderId)"
          >
            <a>
              {{ props.item.orderId }} (More...)
            </a>
          </td>
          <td>{{ props.item.first }}</td>
          <td>{{ props.item.last }}</td>
          <td>{{ props.item.nick }}</td>
          <td>{{ props.item.dob | date }}</td>
          <td>{{ props.item.mobile }}</td>
          <td>{{ props.item.bedAndBreakfast ? 'Yes' : 'No' }}</td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Fuse from 'fuse.js'
import Moment from 'moment'

export default {
  name: 'AdminParticipants',
  filters: {
    date (value) {
      let date = new Moment(value)

      return date.format('DD/MM/YYYY')
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
          value: 'order.status',
          text: 'Order Status'
        },
        {
          value: 'orderId',
          text: 'Order'
        },
        {
          value: 'first',
          text: 'First Name'
        },
        {
          value: 'last',
          text: 'Last Name'
        },
        {
          value: 'nick',
          text: 'Nickname'
        },
        {
          value: 'dob',
          text: 'Date of Birth'
        },
        {
          value: 'mobile',
          text: 'Mobile'
        },
        {
          text: 'Bed and Breakfast',
          value: 'bedAndBreakfast'
        }
      ],
      pagination: {
        rowsPerPage: 20
      }
    }
  },
  computed: {
    ...mapState('admin', {
      participants: state => state.participants
    })
  },
  methods: {
    search (items, search) {
      if (search === '') {
        return items
      }

      const fuse = new Fuse(items, {
        shouldSort: true,
        keys: ['first', 'last', 'nick', 'id'],
        maxPatternLength: 12
      })

      return fuse.search(search)
    }
  }
}
</script>
