/* eslint-disable */

<template>
  <div id="termsconditions">
    <v-card>
      <v-card-title><h1>Terms and Conditions</h1></v-card-title>
      <v-divider />
      <v-card-text>
        <strong>
          We take everyone’s safety and privacy seriously at the Big Bike Bash so before
          proceeding with your purchase we require you to read and accept our
          <a
            href="/termsandconditions.pdf"
            target="_blank"
          >
            Terms and Conditions
          </a>,
          <a
            href="/codeofconduct.pdf"
            target="_blank"
          >
            Code of Conduct
          </a>
          and
          <a
            href="/privacypolicy.pdf"
            target="_blank"
          >
            Privacy and Cookie Policy.
          </a>
          The purchase of tickets, attendance and participation in the Event is subject to the purchaser accepting the
          following and in doing so confirming that they have obtained the necessary consent
          of anyone for whom he/she has purchased a ticket including any under 18’s in their
          care during the Event. This does not affect your statutory rights.
        </strong>
        <v-checkbox v-model="acceptTC">
          <template slot="label">
            <div class="black--text">
              I confirm I am 18 years old or over and I have read, understood and accept the
              <a
                href="/termsandconditions.pdf"
                target="_blank"
              >
                Terms and Conditions
              </a>
              and
              <a
                href="/codeofconduct.pdf"
                target="_blank"
              >
                Code of Conduct
              </a>
              and have obtained the necessary consent from everyone for whom I am purchasing a ticket.
            </div>
          </template>
        </v-checkbox>
        <v-checkbox v-model="privacy">
          <template slot="label">
            <div class="black--text">
              I confirm I am 18 years old or over and I have read, understood and accept the
              <a
                href="/privacypolicy.pdf"
                target="_blank"
              >
                Privacy and Cookie Policy
              </a>
              and have obtained the necessary consent from everyone for whom I am purchasing a ticket.
            </div>
          </template>
        </v-checkbox>

        <p class="red--text" v-if="!(acceptTC && privacy)">You must accept all conditions to continue</p>
        <v-btn
          color="primary"
          @click="acceptTerms"
          :disabled="!(acceptTC && privacy)"
        >
          Accept
          <v-icon
            dark
            right
          >
            check_circle
          </v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'TermsConditions',
  data () {
    return {
      acceptTC: false,
      privacy: false
    }
  },
  methods: {
    acceptTerms () {
      this.$store.commit('store/acceptTerms')
      this.$router.push('/store/order/participants')
    }
  }
}
</script>
