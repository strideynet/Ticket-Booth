<template>
  <div class="home">
      <v-card>
          <v-card-text>
            <v-layout align-center>
              <v-flex class="text-xs-center">
                <h3 class="display-3">Welcome to the big bike bash ticket portal</h3>

                <span class="subheading">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</span>

                <v-divider class="my-3"></v-divider>

                <div class="title mb-3">Tickets sold</div>
                <v-progress-linear 
                  :value = "percentageSold"
                >
                </v-progress-linear>
                <v-btn
                  class="mx-0"
                  color="primary"
                  to = "Order"
                >
                  Start Order
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
      </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "home",
  computed: {
    percentageSold() {
      return this.currentParticipants / this.maxParticipants;
    },
    ...mapState({
      maxParticipants: state => state.settings.maxParticipants,
      currentParticipants: state => state.settings.currentParticipants
    })
  }
};
</script>
