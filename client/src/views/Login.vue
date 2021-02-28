<template>
  <v-app>
    <v-alert
      v-model="failed"
      dismissible
      type="error"
    >
      Login was not succesful. Check your login details.
    </v-alert>
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md4
          >
            <v-card class="elevation-12">
              <v-toolbar
                dark
                color="primary"
              >
                <v-toolbar-title>BBB Admin</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="auth.user"
                    prepend-icon="person"
                    label="Login"
                    type="text"
                  />
                  <v-text-field
                    id="password"
                    v-model="auth.pass"
                    prepend-icon="lock"
                    label="Password"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  @click="attemptLogin"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      auth: {
        user: '',
        pass: ''
      },
      failed: false
    }
  },
  methods: {
    attemptLogin () {
      this.$store.dispatch('admin/login', this.auth)
        .then(() => this.$router.push('/admin'))
        .catch(() => {
          this.failed = true
        })
    }
  }
}
</script>
