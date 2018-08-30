<template>
  <div>
      <h1>Add Participants</h1>

      <v-layout row wrap>
        <participant v-for="individual in participants" :key="individual.uid" :iuid='individual.uid'
        @updateParticipant='handleParticipantUpdate' @deleteParticipant='handleParticipantDelete'/>
      </v-layout>

      <v-btn color="primary"
      @click='addParticipant'
      >
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
  data () {
    return {
      uidCount: 0,
      participants: [{uid: 1}, {uid: 2}]
    }
  },
  methods: {
    finishParticipants () {
      this.$store.commit('finishParticipants', this.participants)
    },
    handleParticipantUpdate (participant) {
      let index = this.participants.findIndex(value => {
        return value.uid === participant.uid
      })

      this.participants.index = participant
    },
    handleParticipantDelete (uid) {
      let index = this.participants.findIndex(value => {
        return value.uid === uid
      })

      this.participants.splice(index, 1)
    },
    addParticipant () {
      this.participants.push({uid: this.uidCount++})
    }
  }
}
</script>
