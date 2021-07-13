<template>
  <v-row>
    <v-col class="text-center">
      <div>
        <form>
          <h2>비밀번호 찾기</h2>
          <input
                 type="email"
                 autocomplete="username"
                 placeholder="이메일주소"
                 class="input"><br>
          <input
                 type="password"
                 autocomplete="current-password"
                 placeholder="비밀번호"
                 class="input"><br>
          <input
            type="text"
            placeholder="비밀번호"
            class="input"><br>
          <v-btn
            color="primary"
            class="btn-login"
          >
            시작하기
          </v-btn><br>
        </form>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "password"
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
