<template>
  <div>
      <h1>Participants</h1>

      <v-btn
      color="primary"
      @click="finishParticipants"
      >
      Finish
    </v-btn>
  </div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: 'Participants',
  methods: {
    finishParticipants: function() {
      this.$store.commit('finishParticipants')
    }
  }
}
</script>