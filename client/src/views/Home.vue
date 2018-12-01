<template>
  <div class="home">
      <v-card>
          <v-card-text>
            <v-layout align-center>
              <v-flex class="text-xs-center">
                <h2 class="display-3">Big Bike Bash</h2>
                <h3 class="display-2">23-26 August 2019</h3>
                <br/>

                <div class="text-xs-left">
                  <span class="subheading">
                    Big Bike Bash is returning bigger and better for 2019. We hope you are looking forward to it as much as we are with another year of fun for the whole family.
                    When ordering your tickets please make sure you read the Terms and Conditions carefully.
                    <br/><br/>
                    Should you have any difficulties using the site, please contact help@bigbikebash.org.uk
                  </span>
                </div>

                <v-divider class="my-3"></v-divider>

                <div v-if="isPurchaseAllowed">
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
                </div>
                <div v-else-if="!isSalesOpen">
                  <h1 class="display-1">Sales aren't open yet!</h1>
                  <h2>Open in: {{timeLeft}}</h2>
                </div>
                <div v-else-if="!isTicketsLeft">
                  <h1 class="display-1">Sorry, we sold out.</h1>

                  <p>Please email waiting@bigbikebash.org.uk if you want to be added to the waiting list.</p>
                </div>
                <div v-else>
                  <h1 class="display-1">Ticket sales are disabled.</h1>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
      </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Moment from 'moment'

export default {
  name: 'home',
  computed: {
    percentageSold () {
      return (this.currentParticipants / this.maxParticipants) * 100
    },
    timeLeft () {
      const duration = Moment.duration(new Moment(this.openTime).diff(new Moment()))

      return `${duration.days()} Days, ${duration.hours()} Hours, ${duration.minutes()} Minutes`
    },
    ...mapState({
      maxParticipants: state => state.settings.maxParticipants,
      currentParticipants: state => state.settings.currentParticipants,
      openTime: state => state.settings.salesOpen
    }),
    ...mapGetters(['isSalesOpen', 'isTicketsLeft', 'isPurchaseAllowed'])
  },
  watch: {
    '$route': function () {
      if (this.$route.query.override) {
        this.$store.commit('setOverride', this.$route.query.override)
      }
    }
  }
}
</script>
