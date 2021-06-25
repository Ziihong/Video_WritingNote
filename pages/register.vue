<template>
  <v-row>
    <v-col class="text-center">
      <form class="login-block" onsubmit="return false;">
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
        <input
          v-model="formData.nickname"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline input_interface"
          placeholder="Nickname"
          type="text"
        />
        <br>
        <v-btn
          class="btn"
          color="primary"
          nuxt
          @click="createUser"
        >
          Register
        </v-btn>
        <br>
        <v-btn
          class="btn"
          color="primary"
          @click="createUserGoogle"
        >
          <v-icon left>mdi-google</v-icon>
          Register with Google
        </v-btn>
      </form>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import firebase from "firebase";

export default {
  data: () => ({
    formData: {
      email: '',
      password: '',
      nickname: '',
    },
  }),
  methods: {
    async createUser() {
      try {
        const userCredential = await this.$fire.auth.createUserWithEmailAndPassword(
          this.formData.email,
          this.formData.password,
        )
        await userCredential.user.updateProfile({
          displayName: this.formData.nickname,
          }
        )
        await this.$router.push('/');
      } catch (e) {
        alert(e)
      }
    },
    async createUserGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      try{
        await this.$fire.auth.signInWithPopup(provider);
        await this.$router.push('/');
      } catch (e) {
        alert(e)
      }
    }
  },
}
</script>

<style>
.input_interface{
  background-color: white;
  width : 300px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

</style>
