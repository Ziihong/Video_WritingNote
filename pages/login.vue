<template>
  <v-row>
    <v-col class="text-center">
      <div>
        <h2>로그인</h2><br>
        <form v-if="!isLoggedIn" onsubmit="return false;" class="login-form">
          <input v-model="formData.email"
                 type="email"
                 autocomplete="username"
                 placeholder="이메일주소"
                 class="input"><br>
          <input v-model="formData.password"
                 type="password"
                 autocomplete="current-password"
                 placeholder="비밀번호"
                 class="input"><br>
          <v-btn
            @click="signInUser"
            color="primary"
            to="/login"
            class="btn-login"
          >
            로그인
          </v-btn>
          <br>
          <v-btn
            color="primary"
            to="/signup"
            class="btn-login"
          >
            회원가입
          </v-btn>
          <br>
          <a>아이디/비밀번호 찾기</a><br>
          <p>or</p>
          <v-btn
            @click="signWithGoogle"
            color="red"
            to="/login"
            class="btn-login"
          >
            Google Login
          </v-btn>
          <br>
        </form>
        <div v-else>
          <p>You are logged in with {{ authUser.email }}.</p>
          <v-btn color="primary" outlined @click="logout">Logout</v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import firebase from "firebase";

export default {
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  signInoptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      authMethod: "https://accounts.google.com",
      clientId:
        "758980168580-t8a6ht866oe3b8mm0nurjk3qep6vfk6k.apps.googleusercontent.com"
    },
  ],
  data: () => ({
    formData: {
      email: '',
      password: '',
    },
  }),
  methods: {
    async signInUser() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        )
      } catch (e) {
        alert(e)
      }
    },
    async signWithGoogle() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await this.$fire.auth.signInWithRedirect(provider)
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
.input {
  background-color: aliceblue;
  margin-bottom: 10px;
  width: 250px;
  height: 40px;
}

a {
  text-decoration: none;
  color: cornflowerblue;
}

.btn-login {
  width: 250px;
  margin-bottom: 10px;
}

</style>
