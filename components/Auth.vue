<template>
  <div class="logInForm">
<!--    <h2>AUTH Example</h2>-->
<!--    <div style="margin: 40px 0">-->
<!--      <client-only>-->
<!--        <Codeblock>-->
<!--        <pre>-->
<!--async createUser() {-->
<!--  try {-->
<!--    await this.$fire.auth.createUserWithEmailAndPassword('foo@foo.foo', 'test')-->
<!--  } catch (e) {-->
<!--    alert(e)-->
<!--  }-->
<!--}-->
<!--        </pre>-->
<!--        </Codeblock>-->
<!--      </client-only>-->
<!--    </div>-->
    <form v-if="!isLoggedIn" onsubmit="return false;">
      <h3>Log In</h3><br>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email
        </label>
        <v-text-field
          v-model="formData.email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Email"
          type="email"
          autocomplete="username">
        </v-text-field>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Password
        </label>
        <v-text-field
          v-model="formData.password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Password"
          type="password"
          autocomplete="current-password">
        </v-text-field>
      </div>
      <v-btn @click="signInUser">Sign In</v-btn>
      <v-btn @click="createUser"><router-link to="signUp">Register</router-link></v-btn>

    </form>
    <div v-else>
      <p>You are logged in with {{ authUser.email }}.</p>
      <v-btn color="primary" outlined @click="logout">Logout</v-btn>
    </div>
  </div>
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
    // async createUser() {
    //   try {
    //     await this.$fire.auth.createUserWithEmailAndPassword(
    //       this.formData.email,
    //       this.formData.password
    //     )
    //   } catch (e) {
    //     alert(e)
    //   }
    // },
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
  .logInForm{
    margin: 0 auto;
    width: 35%;
  }
</style>
