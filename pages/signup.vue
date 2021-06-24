<template>
  <v-row>
    <v-col class="text-center">
      <div>
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
        >
          시작하기
        </v-btn><br>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
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
        location.href="/login"
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
}
</style>
