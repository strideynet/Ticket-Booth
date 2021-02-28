<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>BigBikeBash Admin</v-toolbar-title>

      <v-spacer />

      <v-toolbar-items>
        <v-btn
          flat
          to="/admin/dash"
        >
          Dashboard
        </v-btn>
        <v-btn
          flat
          to="/admin/orders"
        >
          Orders
        </v-btn>
        <v-btn
          flat
          to="/admin/participants"
        >
          Participants
        </v-btn>

        <v-btn
          icon
          @click="fetchAllData"
        >
          <v-progress-circular
            v-if="isAnythingLoading"
            indeterminate
            color="primary"
          />
          <v-icon v-else>
            refresh
          </v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'AdminFrame',
  computed: {
    ...mapGetters('admin', ['isAnythingLoading'])
  },
  created () {
    this.fetchAllData()
  },
  methods: {
    ...mapActions('admin', ['fetchAllData'])
  }
}
</script>
