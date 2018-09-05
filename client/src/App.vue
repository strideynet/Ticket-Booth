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
      <p>Sites loading yo</p>
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
