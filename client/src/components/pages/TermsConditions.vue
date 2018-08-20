<template>
  <div>
      <h1>Terms and Conditions</h1>

      <h2>GPDR etc</h2>
      <p>
        As part of our ticketing system we have to store your data in order for it to be used for signing-in.
        You information may also be used by the BigBikeBash team internally in order to learn more about the overall demographics attending the Bash.

        At no point will your data be transferred to an organisation or person outside of Action Academy and the greatest efforts will be made to
        ensure your details remain secure.
      </p>

      <h2>Bash T&Cs</h2>
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing 
      elit. Aenean commodo ligula eget dolor. Aenean massa 
      <strong>strong</strong>. Cum sociis natoque penatibus 
      et magnis dis parturient montes, nascetur ridiculus 
      mus. Donec quam felis, ultricies nec, pellentesque 
      eu, pretium quis, sem. Nulla consequat massa quis 
      enim. Donec pede justo, fringilla vel, aliquet nec, 
      vulputate eget, arcu. In enim justo, rhoncus ut, 
      imperdiet a, venenatis vitae, justo. Nullam dictum 
      felis eu pede <a class="external ext" href="#">link</a> 
      mollis pretium. Integer tincidunt. Cras dapibus. 
      Vivamus elementum semper nisi. Aenean vulputate 
      eleifend tellus. Aenean leo ligula, porttitor eu, 
      consequat vitae, eleifend ac, enim. Aliquam lorem ante, 
      dapibus in, viverra quis, feugiat a, tellus. Phasellus 
      viverra nulla ut metus varius laoreet. Quisque rutrum. 
      Aenean imperdiet. Etiam ultricies nisi vel augue. 
      Curabitur ullamcorper ultricies nisi.</p>
     <v-btn
      color="primary"
      @click="acceptTerms"
    >
      Accept
    </v-btn>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';

export default {
  name: 'TermsConditions',
  methods: {
    ...mapMutations(['acceptTerms'])
  }
}
</script>