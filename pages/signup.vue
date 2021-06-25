<template>
  <v-row>
    <v-col class="text-center">
      <div>
        <form v-if="!isLoggedIn" onsubmit="return false;">
        <h2>회원가입</h2>
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
          @click="createUser"
          color="primary"
          class="btn-login"
        >
          시작하기
        </v-btn><br>
        </form>
        <div v-else>
          <h3>회원가입이 완료되었습니다.</h3>
          <p>You are logged in with {{ authUser.email }}.</p>
          <v-btn color="primary" outlined @click="logout">Logout</v-btn>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {mapGetters, mapState} from 'vuex';

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
  methods:{
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
  },
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

.btn-login {
  width: 250px;
  margin-bottom: 10px;
}
</style>
