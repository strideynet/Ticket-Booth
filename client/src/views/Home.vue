<template>
  <div class="home">
      <v-layout align-center>
        <v-flex>
          <h3 class="display-3">Welcome to the site</h3>

          <span class="subheading">Lorem ipsum dick dolor sit amet, pri veniam forensibus id. Vis maluisset molestiae id, ad semper lobortis cum. At impetus detraxit incorrupte usu, repudiare assueverit ex eum, ne nam essent vocent admodum.</span>

          <v-divider class="my-3"></v-divider>

          <div class="title mb-3">Tickets sold</div>
          <v-progress-linear 
          value = "percentageSold"
          >

          </v-progress-linear>

          <v-btn
            class="mx-0"
            color="primary"
            large
            to = "Order"
          >
            Start Order
          </v-btn>
        </v-flex>
      </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  computed:{
    percentageSold () {
      return this.currentParticipants / this.maxParticipants
    },
    ...mapState({
      maxParticipants: state => state.settings.maxParticipants,
      currentParticipants: state => state.settings.currentParticipants
    })
  }
}
</script>
