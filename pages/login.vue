<template>
  <v-card style="width:320px; top:100px;" class="mx-auto">
    <v-card-title>
      로그인
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field v-model="form.email" label="이메일 주소"></v-text-field>
        <v-text-field
          v-model="form.password"
          label="비밀번호"
          type="password"
          :append-icon="form.show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[form.rules.required, form.rules.min]"
          :type="form.show1 ? 'text' : 'password'"
          hint="At least 8 characters"
          couter
          @click:append="form.show1 = !form.show1">
        </v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn class="blue white--text" style="width:100%" @click="signIn">
        로그인
      </v-btn>
    </v-card-actions><br/>

    <v-card-actions>
      <v-btn class="white black--text" style="width:100%" @click="googleLogin">
        <v-icon left>fab fa-google</v-icon>
        구글 계정으로 로그인
      </v-btn>
    </v-card-actions>

    <v-card-actions>
      <v-container>
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn class="blue--text" style="background-color: transparent" @click="signUp">회원가입</v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn class="blue--text" style="background-color: transparent">비밀번호 찾기</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>

  </v-card>
</template>

<script>
import firebase from "firebase";

export default {
  layout: 'empty',
  data() {
    return {
      form: {
        email: '',
        password: '',
        show1: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      }
    }
  },

  methods: {
    async signIn() {
      try {
        const r = await this.$fire.auth.signInWithEmailAndPassword(
          this.form.email,
          this.form.password
        )
        await this.$router.push('/')
      } catch (e) {
        alert(e.message)
      }
    },

    async signUp() {
      await this.$router.push('/auth')
    },

    async googleLogin() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider()
        this.$fire.auth.languageCode = 'Korean'
        const r = await this.$fire.auth.signInWithPopup(provider)
        this.$store.commit('setUser', r.user)

        // Add google user uid in firestore
        this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`)
        .get().then(user => {
          if (user.exists) {
            console.log("This google user's uid already set in firestore")
            console.log(this.$fire.auth.currentUser.uid)
          }
          else {
            const ref = this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid)
            ref.set({ name: this.$fire.auth.currentUser.displayName })
          }
        })

        await this.$router.push('/')

      } catch (e) {
        console.error(e.message)
      }
    },

    async reqNormal() {
      const tk = await this.$fire.auth.currentUser.getIdToken()
      this.$axios.setToken(tk)
      const data = await this.$axios.get(
        'http://localhost:3000/login'
      )
      console.log(data)
    }
  }
}
</script>
