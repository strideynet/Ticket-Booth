<template>
  <v-app id="app">
    <v-toolbar app>
      <v-toolbar-title>BigBikeBash Ticket Portal</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<style lang="stylus">
  @import '~vuetify/src/stylus/main' // Ensure you are using stylus-loader  
</style>
