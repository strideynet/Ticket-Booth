<template>
  <div class="home">
      <v-card>
        <v-responsive :aspect-ratio="16/0">
          <v-card-text>
            <v-layout align-center>
              <v-flex>
                <h3 class="display-3">Welcome to the big bike bash ticket portal</h3>

                <span class="subheading"></span>

                <v-divider class="my-3"></v-divider>

                <div class="title mb-3">Tickets sold</div>
                <v-progress-linear 
                  :value = "percentageSold"
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
          </v-card-text>
        </v-responsive>
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
