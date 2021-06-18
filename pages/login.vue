<template>
  <v-row>
    <v-col class="text-center">
        <form class="login-block" v-if="!isLoggedIn" onsubmit="return false;">
          <input
            v-model="formData.email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input_interface"
            placeholder="Email"
            type="email"
            autocomplete="username"
            />
          <br>
          <input
            v-model="formData.password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input_interface"
            placeholder="Password"
            type="password"
            autocomplete="current-password"
          />
          <br>
          <v-btn
            class="btn"
            color="primary"
            nuxt
            @click="signInUser"
          >
            Login
          </v-btn>
          <br>
          <p>Doesn't have Account Yet?</p>
          <v-btn
            class="btn"
            color="primary"
            nuxt
            to="/register"
          >
            Register
          </v-btn>
        </form>
      <div v-else>
        <p>You are logged in with {{ authUser.email }}.</p>
        <v-btn color="primary" outlined @click="logout">Logout</v-btn>
      </div>
    </v-col>
  </v-row>
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
    },
  }),
  methods: {
    async createUser() {
      try {
        await this.$fire.auth.createUserWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        )
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
        await this.$router.go(-1);
      } catch (e) {
        alert(e)
      }
    },
    async logout() {
      try {
        await this.$fire.auth.signOut()
      } catch (e) {
        alert(e)
      }
    },
  },
}
</script>

<style scoped>
.login-block{
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}
.input_interface{
  background-color: white;
  width : 300px;
  margin-left: auto;
  margin-right: auto;
}
.btn{
  margin-left: auto;
  margin-right: auto;
  width : 200px;
}
</style>
