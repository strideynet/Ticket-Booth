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
            :error-messages="$v.first.$invalid ? 'This field is required' : null"
          ></v-text-field>

          <v-text-field
            label="Last Name"
            placeholder="Placeholder"
            v-model="last"
            :error-messages="$v.last.$invalid ? 'This field is required' : null"
          ></v-text-field>

          <v-text-field
            label="Nickname"
            placeholder="Placeholder"
            v-model="nick"
            counter="16"
            :error-messages="$v.nick.$invalid ? 'Nicknames must be between 4 and 16 chars.' : null"
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
                label="Birth date"
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
        {{bashAge()}}
      </v-card-text>

      <v-divider/>
      <v-card-actions>
        <v-btn color="error" @click='deleteParticipant(participant)'>
          Delete
          <v-icon dark right>cancel</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { mapMutations } from 'vuex'
import moment from 'moment'

import { minLength, maxLength, required } from 'vuelidate/lib/validators'

// Producers getter and setter for the participant. Links to store.
function produceComputedProperty (key) {
  return {
    get () {
      return this.participant[key]
    },
    set (value) {
      this.updateParticipant({
        key,
        value,
        participant: this.participant
      })
    }
  }
}

export default {
  name: 'participant',
  props: ['participant'],
  computed: {
    ...['first', 'last', 'nick', 'mobile', 'dob'].reduce((acc, key) => ({...acc, [key]: produceComputedProperty(key)}), {}), // maps getter/setters for participant fancily
    age () {
      if (this.dob) {
        return moment(this.$store.state.settings.bashDate).diff(this.dob, 'years')
      }
    }
  },
  data () {
    return {
      dateSelector: false
    }
  },
  watch: {
    dateSelector (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    saveDate (date) {
      this.$refs.dateSelector.save(date)
    },
    bashAge () {
      return this.dob ? `That makes them ${this.age} at the bash` : ''
    },
    ...mapMutations(['deleteParticipant', 'updateParticipant'])
  },
  created () {
    this.$watch(() => this.$v.$invalid, (newVal, oldVal) => {
      this.updateParticipant({
        key: 'invalid',
        value: newVal,
        participant: this.participant
      })
    }, { immediate: true })
  },
  validations: {
    first: {
      required
    },
    last: {
      required
    },
    nick: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(16)
    }
  }
}
</script>
