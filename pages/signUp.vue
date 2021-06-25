<template>
  <div class="signUpForm">
    <h3>Sign Up</h3><br>
    <v-form>
      <span>Name  </span>
      <v-text-field
        v-model="formData.name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="ex)홍길동">
      </v-text-field>
      <span>Email  </span>
      <v-text-field
        v-model="formData.email"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="email">
      </v-text-field>
      <span>PassWord  </span>
      <v-text-field
        v-model="formData.password"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="password"
        placeholder="6자리 이상">
      </v-text-field>
    </v-form>
    <v-btn @click="createUser">Register</v-btn>
    <v-btn><router-link to="/logIn">Back to Login</router-link></v-btn>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: "signUp",
  data: () => ({
    formData: {
      name: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    async createUser() {
      try {
        const userCredential = await this.$fire.auth.createUserWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        )
        await userCredential.user.updateProfile({
          displayName: this.formData.name,
        })
        await this.$router.push('/')

      } catch (e) {
        alert(e)
      }
    },
  }
}
</script>

<style scoped>
  .signUpForm{
    margin: 0 auto;
    width: 35%;
  }
</style>
