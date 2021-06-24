<template>
  <v-row>
    <v-col class="text-center">
      <div class="login">
        <h2>로그인</h2><br>
        <input type="text" placeholder="이메일주소" class="input"><br>
        <input type="text" placeholder="비밀번호" class="input"><br>
        <v-btn
          color="primary"
          nuxt
          to="/login"
        >
          로그인
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
name: "login"
}
</script>

<style scoped>
.input{
  background-color: aliceblue;
  margin-bottom: 10px;
}
</style>
