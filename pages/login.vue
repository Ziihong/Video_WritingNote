<template>
  <Auth/>
</template>

<script>
import Auth from '~/components/Auth';
export default {
  layout: 'empty',
  computed:{
    Auth
  }
}
</script>

<style scoped>
template{
  width: 35%;
}
</style>

<!--<template>-->
<!--  <div class="logIn">-->
<!--    <h3>Log In</h3><br>-->
<!--    <v-form v-if="!isLoggedIn" onsubmit="return false;">-->
<!--      <span>Email  </span>-->
<!--      <v-text-field-->
<!--        v-model="formData.email"-->
<!--        type="text"-->
<!--        placeholder="email">-->
<!--      </v-text-field>-->
<!--      <span>PassWord  </span>-->
<!--      <v-text-field-->
<!--        v-model="formData.password"-->
<!--        type="password"-->
<!--        placeholder="password">-->
<!--      </v-text-field>-->
<!--      <v-btn @click="signInUser">Log In</v-btn><br>-->
<!--      <v-btn><router-link to="/signUp">sign Up</router-link></v-btn>-->
<!--    </v-form>-->
<!--    <div v-else>-->
<!--      <p>Hello! {{ authUser.displayName }}.</p>-->
<!--      <v-btn color="primary" outlined @click="logout">Logout</v-btn>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->

<!--import {mapGetters, mapState} from "vuex";-->

<!--export default {-->
<!--  name: 'logIn',-->
<!--  data: () => ({-->
<!--    formData: {-->
<!--      email: '',-->
<!--      password: ''-->
<!--    },-->
<!--  }),-->
<!--  computed: {-->
<!--    ...mapState({-->
<!--      authUser: state => state.authUser,-->
<!--    }),-->
<!--    ...mapGetters({-->
<!--      isLoggedIn: 'isLoggedIn',-->
<!--    }),-->
<!--  },-->
<!--  methods: {-->
<!--    async signInUser() {-->
<!--      try {-->
<!--        await this.$fire.auth.signInWithEmailAndPassword(-->
<!--          this.formData.email,-->
<!--          this.formData.password-->
<!--        )-->
<!--      } catch (e) {-->
<!--        alert(e)-->
<!--      }-->
<!--    },-->
<!--    async logout() {-->
<!--      try {-->
<!--        await this.$fire.auth.signOut()-->
<!--      } catch (e) {-->
<!--        alert(e)-->
<!--      }-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style scoped>-->
<!--  .logIn{-->
<!--    margin-top: 40px;-->
<!--  }-->
<!--  .logInForm{-->
<!--    margin: 0 auto;-->
<!--  }-->
<!--  input{-->
<!--    margin: 10px 0;-->
<!--    width: 20%;-->
<!--    padding:15px;-->
<!--    color: white;-->
<!--  }-->
<!--  button{-->
<!--    margin-top: 30px;-->
<!--    width: 10%;-->
<!--    cursor: pointer;-->
<!--  }-->
<!--</style>-->

