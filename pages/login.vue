<template>
  <v-row>
    <v-col class="text-center">
      <div>
        <h1>로그인</h1><br>
        <form v-if="!isLoggedIn" onsubmit="return false;" class="login-form">
          <input v-model="formData.email"
                 type="email"
                 autocomplete="username"
                 placeholder="이메일주소 입력"
                 class="input"><br>
          <input v-model="formData.password"
                 type="password"
                 autocomplete="current-password"
                 placeholder="비밀번호 입력"
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
          <a class="align-end">아이디 | 비밀번호 찾기</a><br>
          <p>소셜 회원가입/로그인</p>
          <v-btn
            @click="signWithGoogle"
            color="white"
            to="/login"
            class="btn-login"
          >
            Google 계정으로 시작하기
          </v-btn>

          <br>
        </form>
        <div v-else>
          <p>You are logged in with {{ authUser.email }}.</p>
          <v-btn color="primary" outlined @click="signOut" to="/">로그아웃</v-btn>
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
    params:{
      client_id: "758980168580-t8a6ht866oe3b8mm0nurjk3qep6vfk6k"
    }
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
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        firebase.auth().signInWithPopup(provider).then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const token = result.credential.accessToken;
          // The signed-in user info.
          const user = result.user;
        })
      } catch(e){
        alert(e)
    }
    },
    async signOut() {
      try {
        const link = this.$route.query.name;
        console.log(link);
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
  border-radius: 5px;
  width: 250px;
  height: 40px;
  padding-left: 10px;
}

::placeholder {
  font-size: 12px;
  font-weight: 400;
  border-left: 10px;
}

a {
  text-decoration: none;
  color: cornflowerblue;
  font-size: 12px;
  text-align: right;
}

p{
  margin-top: 20px;
  font-size:14px;
}

.btn-login {
  width: 250px;
  margin-bottom: 10px;
}

</style>
