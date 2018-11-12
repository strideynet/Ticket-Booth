<template>
  <div class="home">
      <v-card>
          <v-card-text>
            <v-layout align-center>
              <v-flex class="text-xs-center">
                <h3 class="display-1">Welcome to the Big Bike Bash ticket portal</h3>
                <div class="text-xs-left">
                  <span class="subheading">
                    Big Bike Bash is returning bigger and better for 2019. We hope you are looking forward to it as much as we are with another year of fun for the whole family.
                    When ordering your tickets please make sure you read the Terms and Conditions carefully.
                    <br/><br/>
                    Should you have any difficulties using the site, please contact help@bigbikebash.org.uk
                  </span>
                </div>
                <v-divider class="my-3"></v-divider>

                <div class="title mb-3">Tickets Sold ({{currentParticipants}}/{{maxParticipants}})</div>
                <v-progress-linear
                  :value = "percentageSold"
                >
                </v-progress-linear>
                <v-btn
                  class="mx-0"
                  color="primary"
                  to = "/order/tc"
                >
                  Start Order
                  <v-icon dark right>chevron_right</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
      </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  computed: {
    percentageSold () {
      return (this.currentParticipants / this.maxParticipants) * 100
    },
    ...mapState({
      maxParticipants: state => state.settings.maxParticipants,
      currentParticipants: state => state.settings.currentParticipants
    })
  }
}
</script>
