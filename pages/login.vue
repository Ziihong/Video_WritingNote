<template>
  <v-row>
    <v-col class="text-center">
      <div>
        <h2>로그인</h2><br>
        <form v-if="!isLoggedIn" onsubmit="return false;" class="login-form" >
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
          >
            로그인
          </v-btn>
        </form>
        <div v-else>
          <p>You are logged in with {{ authUser.email }}.</p>
          <v-btn color="primary" outlined @click="logout">Logout</v-btn>
        </div>
        <br>
        <a>회원가입</a>
        <a>아이디/비밀번호 찾기</a>
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
  data: () => ({
    formData: {
      email:'',
      password:'',
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
}

.login-form{
color:red;
}
</style>
