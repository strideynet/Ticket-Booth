<template>
  <div class="participants">
    <h1>Add Participants</h1>
    <v-divider />

    <v-layout
      row
      wrap
    >
      <Participant
        v-for="(individual, index) in participants"
        :key="`participant-${index}`"
        :participant="individual"
      />
    </v-layout>

    <br>
    <v-divider />

    <v-btn
      color="primary"
      @click="addParticipant"
    >
      Add Another
      <v-icon
        dark
        right
      >
        add_circle
      </v-icon>
    </v-btn>

    <v-btn
      color="success"
      :disabled="!isParticipantsReady"
      @click="clickFinish"
    >
      Finish
      <div v-if="!isParticipantsReady">
        (not complete)
      </div>
      <v-icon
        dark
        right
      >
        chevron_right
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import Participant from '../components/Participant.vue'
import { mapGetters, mapState, mapMutations } from 'vuex'

export default {
  name: 'Participants',
  components: { Participant },
  computed: {
    ...mapState('store', ['participants']),
    ...mapGetters('store', ['isParticipantsReady'])
  },
  mounted () {
    if (this.participants.length === 0) {
      this.addParticipant()
    }
  },
  methods: {
    ...mapMutations('store', ['addParticipant', 'finishParticipants']),
    clickFinish () {
      this.finishParticipants()
      this.$router.push('/store/order/review')
    }
  }
}
</script>
