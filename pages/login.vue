<template>
  <v-row>
    <v-col class="text-center">
        <div class="login-block">
          <input class="input_interface" placeholder="ID" />
          <br>
          <input class="input_interface" placeholder="Password" />
          <br>
          <v-btn
            color="primary"
            nuxt
            to="/login"
          >
            Login
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
.login-block{
  display: block;
}
.input_interface{
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
