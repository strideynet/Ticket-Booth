<template>
  <v-app id="app">
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
    <div v-else>
      <v-layout justify-center>
        <v-card class="text-xs-center" align-center justify-center>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <v-card-text>Loading...</v-card-text>
        </v-card>
      </v-layout>
    </div>
  </v-app>
</template>

<script>
  export default {
    name: 'app',
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

<style lang="stylus">
  @import '~vuetify/src/stylus/main' // Ensure you are using stylus-loader
  @import './main.styl'
</style>
