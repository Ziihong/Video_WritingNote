<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <form v-if="!isLoggedIn" class="registerForm">
        <h2>회원가입</h2>
        <div>
          <input
            v-model="formData.email"
            class="login"
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
        <v-btn color="primary" @click="createUser" class="register">회원가입</v-btn>
        <p onsubmit="return false;"></p>
      </form>
    </v-col>
  </v-row>
</template>

<script>

import {mapGetters, mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
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
  }
}
</script>

<style scoped>
.registerForm {
  text-align: center;
}
.email {
  margin-top: 20px;
}
.login {
  margin-top: 20px;
  border: 1px solid;
  height: 40px;

}
.password {
  margin-top: 20px;
  border: 1px solid;
  height: 40px;

}
.register {
  margin-top: 20px;
}
</style>
