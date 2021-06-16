<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6" >
      <v-card>
        <v-card-title class="headline">
          Login Page
        </v-card-title>
        <v-card-text class="text-center">
          <br>
          <v-form id="login-form">
            <v-container fluid>
              <v-row justify="center" align="center">

                <v-col cols="12" sm="4" md="10">
                  <v-text-field
                    id="email"
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                    placeholder="E-mail"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="10">
                  <v-text-field
                    id="password"
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    hint="At least 8 characters"
                    placeholder="Password"
                    couter
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>

          </v-form>
            <v-btn
              id ="loginBtn"
              color="primary"
              nuxt
              @click="checkLogin()"
              :to="login ? '/' : '/login'"
            >
            log in
            </v-btn>
            <v-spacer/>
            <em><small>&mdash; Junseok Kim</small></em>
            <hr class="my-3">

        </v-card-text>
        <v-card-actions>
          <p>If no account, please register</p>
          <v-spacer/>
          <v-btn
            id ="regBtn"
            color="primary"
            nuxt
            to="/register"
          >
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>

</template>

<script>
export default {

  layout:'empty',
  data(){
    return {
      email: '',
      show1: false,
      password: '',
      login: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      }
    }
  },
  methods: {
    checkLogin(){
      this.login = true;
      //:to="login ? '/' : '/login'"
      if(this.login){
        location.replace('http://localhost:3000/');
      }
      console.log("login:",this.login);
    }
  }
}
</script>
