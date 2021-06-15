<template>
  <v-row>
    <v-col class="text-center">
        <form class="login-block">
          <input class="input_interface" placeholder="ID" />
          <br>
          <input class="input_interface" placeholder="Password" type="password" />
          <br>
          <v-btn
            class="btn"
            color="primary"
            nuxt
            to="/login"
          >
            Login
          </v-btn>
          <br>
          <p>Doesn't have Account Yet?</p>
          <v-btn
            class="btn"
            color="primary"
            nuxt
            to="/login"
          >
            Register
          </v-btn>
        </form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "login"
}
</script>

<style scoped>
.login-block{
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}
.input_interface{
  background-color: white;
  width : 300px;
  margin-left: auto;
  margin-right: auto;
}
.btn{
  margin-left: auto;
  margin-right: auto;
  width : 200px;
}
</style>
