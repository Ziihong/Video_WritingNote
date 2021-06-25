<template>
  <v-card>
    <v-card-title class="headline">
      Login Page
    </v-card-title>
    <br>
    <form v-if="!isLoggedIn" onsubmit="return false;" class ="text-center">

      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="12" sm="4" md="10">
            <v-text-field
              id="email"
              type="email"
              v-model="formData.email"
              :rules="[formData.rules.required, formData.rules.email]"
              placeholder="E-mail"
              autocomplete="username"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4" md="10">
            <v-text-field
              id="password"
              v-model="formData.password"
              :append-icon="formData.show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[formData.rules.required, formData.rules.min]"
              :type="formData.show1 ? 'text' : 'password'"
              hint="At least 8 characters"
              placeholder="Password"
              autocomplete="current-password"
              couter
              @click:append="formData.show1 = !formData.show1"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>

      <v-btn
        id ="loginBtn"
        color="primary"
        @click="signInUser"
      >
        log in
      </v-btn>
      <v-card-text class="text-center">
        <em><small>&mdash; Junseok Kim</small></em>
        <hr class="my-3">
      </v-card-text>
      <v-card-actions>
        <p>If no account, please register</p>
        <v-spacer/>
        <v-btn
          id ="regBtn"
          color="primary"
          @click="createUser"
        >
          Register
        </v-btn>
      </v-card-actions>
    </form>

    <div v-else>
      <p>You are logged in with {{ authUser.email }}.</p>
    </div>

  </v-card>
</template>

<script>

import {mapGetters, mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  // fetch() {
  //   // INFO -> this.$fire.auth user etc. are accessible
  //   // INFO -> this.$store.state.authUser is accessible even on server-side
  // },
  data: () => ({
    formData: {
      email: '',
      password: '',
      show1: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
    },
  }),
  methods: {
    async createUser() {
      try {
        await this.$fire.auth.createUserWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        )
        await this.$router.push('/');
      } catch (e) {
        alert(e)
      }
    },
    async signInUser() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        )
        await this.$router.push('/')
      } catch (e) {
        alert(e)
      }
    },
  },
}
</script>
