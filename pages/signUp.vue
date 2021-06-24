<template>
  <div class="signUp">
    <h3>Sign Up</h3>
    <span>Name  </span><input type="text" placeholder="ex)홍길동"><br>
    <span>Email  </span><input type="text" placeholder="email"><button>중복확인</button><br>
    <span>PassWord  </span><input type="password" placeholder="6자리 이상"><br>
    <button @click="createUser">Register</button><br>
    <button><router-link to="/logIn">Back to Login</router-link></button>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: "signUp",
  data: () => ({
    formData: {
      name: '',
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
    async checkLength(){
      if (this.formData.password.length < 7){
        alert("too short!")
      }
    }
  }
}
</script>

<style scoped>
  .signUp{
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
    text-decoration: cornflowerblue;
  }
</style>
