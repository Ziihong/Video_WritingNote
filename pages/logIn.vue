<template>
  <div class="logIn">
    <h3>Log In</h3>
    <span>Email  </span><input type="text" placeholder="email"><br>
    <span>PassWord  </span><input type="password" placeholder="password"><br>
    <button @click="signInUser">Log In</button><br>
    <button><router-link to="/signUp">signUp</router-link></button>

  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'login',
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
  }
}
</script>
<style scoped>
  .logIn{
    margin-top: 40px;
  }
  input{
    margin: 10px 0;
    width: 20%;
    padding:15px;
    color: white;
  }
  button{
    margin-top: 30px;
    width: 10%;
    cursor: pointer;
  }
</style>
