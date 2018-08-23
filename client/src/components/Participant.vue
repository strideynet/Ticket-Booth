<template>
  <v-flex xs12 lg4>
    <v-card dark>
      <v-card-title primary-title>
          <h3>John Smith</h3>
      </v-card-title>

      <v-divider/>
      <v-card-text>
          FORMFORMFORMFORM
      </v-card-text>
      
      <v-divider/>
      <v-card-actions>
        <v-btn color="error">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["participant"]
};
</script>
