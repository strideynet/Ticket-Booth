<template>
  <div class="order">
    <v-stepper v-model="currentStep">
      <v-stepper-header>
        <div v-for="step in steps" :key="step.name">
          <v-stepper-step :complete="currentStep > step.number" :step="step.number">{{step.name}}</v-stepper-step>

          <v-divider></v-divider>
        </div>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content v-for="step in steps" :key="step.name" :step="step.number">
          <component v-bind:is="step.component"></component>
          <v-btn
            color="primary"
            @click="currentStep = currentStep + 1"
          >
            Continue
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
  </v-stepper>
  </div>
</template>

<script>
import Hello from '@/components/HelloWorld.vue'
import TermsConditions from '@/components/pages/TermsConditions.vue'
import Review from '@/components/pages/Review.vue'
import Participants from '@/components/pages/Participants.vue'

export default {
  name: 'order',
  data: () => {
    return {
      currentStep: 1,
      steps: [
        {
          component: TermsConditions,
          name: 'Terms & Conditions',
          number: 1
        },
         {
          component: Participants,
          name: 'Add Participants',
          number: 2
        },
        {
          component: Review,
          name: 'Review Payment',
          number: 3,
        },
        {
          component: Hello,
          name: 'Pay',
          number: 4
        }
      ]
    }
  }
}
</script>
