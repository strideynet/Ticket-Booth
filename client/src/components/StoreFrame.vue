<template>
  <v-app>
    <div v-if="settingsLoaded">
      <v-toolbar app>
        <v-toolbar-title>BigBikeBash Ticket Portal</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container grid-list-md>
          <router-view></router-view>
        </v-container>
      </v-content>
    </div>
    <v-content v-else>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs1>
            <v-card class="text-xs-center">
              <br/>
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <v-card-text>Loading...</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'StoreFrame',
  computed: {
    settingsLoaded () {
      return Object.keys(this.$store.state.settings).length > 0
    }
  },
  created () {
    this.$store.dispatch('updateSettings')
  }
}
</script>
