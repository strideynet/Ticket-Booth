<template>
  <div>
      <h1>Add Participants</h1>

      <v-layout row wrap>
        <participant v-for="individual in participants" :key="individual.uid" :participant="individual"></participant>
      </v-layout>

      <v-btn color="primary">
        Add Another
      </v-btn>

      <v-btn
      color="warning"
      @click="finishParticipants"
      disabled
      >
      Finish
    </v-btn>

  </div>
</template>

<script>
import Participant from '../Participant.vue'

export default {
  name: 'Participants',
  components: {Participant},
  data: function () {
    return {
      participants: [{uid: 'test'}, {uid: 'tes2t'}, {uid: 'tes2t'}, {uid: 'tes2t'}]
    }
  },
  methods: {
    finishParticipants: function () {
      this.$store.commit('finishParticipants', this.participants)
    }
  }
}
</script>
