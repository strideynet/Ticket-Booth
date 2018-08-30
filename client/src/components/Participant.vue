<template>
  <v-flex xs12 lg4>
    <v-card dark>
      <v-card-title primary-title>
          <h3>{{first}} {{last}}</h3>
      </v-card-title>

      <v-divider/>
      <v-card-text>
        <v-form>
          <v-text-field
            label="First Name"
            placeholder="Placeholder"
            v-model="first"
          ></v-text-field>

          <v-text-field
            label="Last Name"
            placeholder="Placeholder"
            v-model="last"
          ></v-text-field>

          <v-text-field
            label="Nickname"
            placeholder="Placeholder"
            v-model="nick"
          ></v-text-field>

          <v-menu
              ref="dateSelector"
              :close-on-content-click="false"
              v-model="dateSelector"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="dob"
                label="Birthday date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker
                ref="picker"
                v-model="dob"
                :max="new Date().toISOString().substr(0, 10)"
                min="1900-01-01"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>
        </v-form>
      </v-card-text>
      
      <v-divider/>
      <v-card-actions>
        <v-btn color="error" @click='deleteParticipant'>Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: "participant",
  props: ["iuid"],
  data () {
    return {
      uid: this.iuid,
      first: "John",
      last: "Smith",
      nick: "Smithy",
      dob: null,
      dateSelector: false
    }
  },
  watch: {
    dateSelector (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  updated () {
    this.$emit("updateParticipant", {
      uid: this.uid,
      first: this.first,
      last: this.last,
      nick: this.nick,
      dob: this.dob
    })
  },
  methods: {
    deleteParticipant () {
      this.$emit("deleteParticipant", this.uid)
    },
    saveDate (date) {
      this.$refs.dateSelector.save(date)
    }
  }
}
</script>
