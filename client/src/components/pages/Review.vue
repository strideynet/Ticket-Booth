<template>
  <div>
      <h1>Review Order</h1>

      <v-layout wrap>
        <v-flex xs12 lg8>
          <v-card dark>
            <v-card-title primary-title>
                <h3>Order Details</h3>
            </v-card-title>

            <v-divider/>
            <v-card-text>
            </v-card-text>
          </v-card>
          <br/>
          <v-card dark>
            <v-card-title primary-title>
                <h3>Participants</h3>
            </v-card-title>

            <v-divider/>
            <v-card-text>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 lg4>
          <v-card dark>
            <v-card-title primary-title>
                <h3>Price Breakdown</h3>
            </v-card-title>

            <v-divider/>
            <v-card-text>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-btn color="warning"
      @click='$store.state.participantsComplete = false'
      >
        Go Back
        <v-icon dark right>backspace</v-icon>
      </v-btn>
  </div>
</template>

<script src="https://www.paypalobjects.com/api/checkout.js"></script>

<script>
export default {
  name: 'Review',

  mounted () {
  }
}
</script>
