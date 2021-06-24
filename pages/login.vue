<template>
  <v-row>
    <v-col class="text-center">
      <div>
        <h2>로그인</h2><br>
        <form class="login-form">
          <input v-model="uid" placeholder="이메일주소" class="input"><br>
          <input v-model="password" placeholder="비밀번호" class="input"><br>
          <v-btn
            @click="onClick()"
            color="primary"
            to="/login"
          >
            로그인
          </v-btn>
        </form>
        <br>
        <a>회원가입</a>
        <a>아이디/비밀번호 찾기</a>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'login',
  data: () => ({
    uid: '',
    password: ''
  }),
  methods: {
    onClick() {
      console.log(this.uid)
      console.log(this.password)
    }
  }
}

</script>

<style scoped>
.input {
  background-color: aliceblue;
  margin-bottom: 10px;
}
</style>
