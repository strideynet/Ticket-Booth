<template>
  <div>
      <h1>Add Participants</h1>

      <v-layout row wrap>
        <participant v-for="(individual, index) in participants" :key='`participant-${index}`' :participant="individual"/>
      </v-layout>

      <v-btn color="primary"
      @click='addParticipant'
      >
        Add Another
        <v-icon dark right>add_circle</v-icon>
      </v-btn>

      <v-btn
      color="warning"
      @click="finishParticipants"
      disabled
      >
      Finish
      <v-icon dark right>chevron_right</v-icon>
    </v-btn>

  </div>
</template>

<script>
import Participant from '../Participant.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Participants',
  components: {Participant},
  computed: mapState(['participants']),
  methods: mapMutations(['addParticipant', 'finishParticipants']),
  mounted () {
    this.addParticipant()
  }
}
</script>
