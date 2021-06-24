<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <form v-if="!isLoggedIn" onsubmit="return false;" class="formClass">
        <h2>로그인</h2>
        <div>
          <input
            v-model="formData.email"
            class="email"
            placeholder="Email"
            type="email"
            autocomplete="username"/>
        </div>
        <div>
          <input
            v-model="formData.password"
            class="password"
            placeholder="Password"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <v-btn color="primary" @click="logInUser" class="logInButton">로그인</v-btn>
        <br>
        <v-btn color="white" @click="googleSignIn" class="googleLogIn">구글 계정으로 로그인</v-btn>
        <br>
        <p color="white" @click="$router.push('/register')" class="registerButton">회원가입</p>
      </form>
      <div v-else>
        <p>You are logged in with {{ authUser.email }}.</p>
      </div>
    </v-col>
  </v-row>
</template>

<script>

import {mapGetters, mapState} from 'vuex'
import firebase from 'firebase'

let firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appID: "app-id",
}


export default {
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  data: () => ({
    formData: {
      email: '',
      password: '',
    },
  }),
  methods: {
    async googleSignIn () {
      this.provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(this.provider).then(result => {
        this.$router.push('/home')
      }).catch(e => {
        alert(e)
      })
    },
    async logInUser() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        )
      } catch (e) {
        alert(e)
      }
    },
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
    async logout() {
      try {
        await this.$fire.auth.signOut()
      } catch (e) {
        alert(e)
      }
    },
  }
}
</script>

<style scoped>

.formClass {
  display: block;
  text-align: center;
  margin-top: 100px;
}

.email {
  margin-top: 20px;
  border: 1px solid gray;
  height: 40px;
}
.password {
  margin-top: 20px;
  border: 1px solid gray;
  height: 40px;
}
.logInButton {
  margin-top: 15px;
  width: 180px;
}
.googleLogIn {
  margin-top: 10px;
}
.registerButton {
  text-align: left;
  margin-left: 180px;
  margin-top: 10px;
  color: blue;
  appearance: none;
}
</style>
