<template>
  <v-flex
    xs12
    lg4
  >
    <v-card class="elevation-6">
      <v-card-title primary-title>
        <h3>{{ first }} {{ last }}</h3>
      </v-card-title>

      <v-divider />
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="first"
            :error-messages="$v.first.$invalid ? 'This field is required' : null"
            label="First Name"
            placeholder="Placeholder"
          />

          <v-text-field
            v-model="last"
            :error-messages="$v.last.$invalid ? 'This field is required' : null"
            label="Last Name"
            placeholder="Placeholder"
          />

          <v-text-field
            v-model="nick"
            :error-messages="$v.nick.$invalid ? 'Nicknames must be between 2 and 16 chars' : null"
            label="Raceplate Nickname"
            placeholder="Placeholder"
            counter="16"
            hint="This nickname will appear on your number-plate. Keep it family friendly!"
            persistent-hint
          />

          <v-select
            v-model="gender"
            :items="genderOptions"
            :error-messages="$v.gender.$invalid ? 'Gender is a required field' : null"
            label="Gender"
          />

          <v-menu
            ref="dateSelector"
            v-model="dateSelector"
            :close-on-content-click="false"
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
              :error-messages="$v.dob.$invalid ? 'DoB is a required field' : null"
              label="Birth date"
              prepend-icon="event"
              readonly
            />
            <v-date-picker
              ref="picker"
              v-model="dob"
              :max="new Date().toISOString().substr(0, 10)"
              min="1900-01-01"
              @change="saveDate"
            />
          </v-menu>

          <v-text-field
            v-if="age >= 18"
            v-model="mobile"
            :error-messages="$v.mobile.$invalid ? 'Must be a valid phone number' : null"
            label="Mobile Number"
            placeholder=""
            hint="We will only use this for emergency contact at BBB"
            persistent-hint
          />
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-btn
          color="error"
          @click="deleteParticipant(participant)"
        >
          Delete
          <v-icon
            dark
            right
          >
            cancel
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { mapMutations } from 'vuex'
import { genderOptions } from '@/helpers/constants'
import moment from 'moment'

import { minLength, maxLength, required, requiredIf } from 'vuelidate/lib/validators'

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
  name: 'Participant',
  props: ['participant'],
  data () {
    return {
      dateSelector: false,
      genderOptions
    }
  },
  computed: {
    ...['first', 'last', 'nick', 'mobile', 'dob', 'gender'].reduce((acc, key) => ({ ...acc, [key]: produceComputedProperty(key) }), {}), // maps getter/setters for participant fancily
    age () {
      if (this.dob) {
        return moment(this.$store.state.store.settings.bashDate).diff(this.dob, 'years')
      }

      return 0
    },
  },
  watch: {
    dateSelector (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  created () {
    this.$watch(() => this.$v.$invalid, (newVal, oldVal) => { // Handle updating the invalid property of the participant store-side
      this.updateParticipant({
        key: 'invalid',
        value: newVal,
        participant: this.participant
      })
    }, { immediate: true })
  },
  methods: {
    saveDate (date) {
      this.$refs.dateSelector.save(date)
    },
    ...mapMutations('store', ['deleteParticipant', 'updateParticipant'])
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
      minLength: minLength(2),
      maxLength: maxLength(16)
    },
    dob: {
      required
    },
    mobile: {
      requiredIf: requiredIf(function () {
        return this.age >= 18
      })
    },
    gender: {
      required
    },
  }
}
</script>
