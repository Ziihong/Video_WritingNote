<template>
  <v-card style="width:320px; top:100px" class="mx-auto">
    <v-card-title>
      회원가입
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field v-model="form.name" label="이름"></v-text-field>
        <v-text-field v-model="form.email" label="이메일 주소"></v-text-field>
        <v-text-field v-model="form.password" label="비밀번호" type="password"></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn class="blue white--text" style="width:100%" @click="signUp">
        시작하기
      </v-btn>
    </v-card-actions>

    <v-card-text class="text-center"> OR </v-card-text>

    <v-card-actions>
      <v-btn class="white black--text" style="width:100%" @click="googleLogin">
        <v-icon left>fab fa-google</v-icon>
        구글 계정으로 로그인
      </v-btn>
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
        name: null,
        email: null,
        password: null,
      },
      msg: ''
    }
  },

  methods: {
    async signUp() {
      try {
        const r = await this.$fire.auth.createUserWithEmailAndPassword(
          this.form.email,
          this.form.password

        ).then((userCredential) => {
          let user = userCredential.user;
          user.updateProfile({
            displayName: this.form.name
          })
        }).catch((e) => {
          console.error(e.message)
        })
        // Add user uid in firestore
        let ref = this.$fire.firestore.collection('users').doc(this.$fire.auth.currentUser.uid)
        await ref.set({ name: this.form.name })

        // Add user's file in firestore
        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`)
        .collection('files').add({
            name: 'sample',
            path: '/',
            timestamp: new Date().toLocaleString()
        })
        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`)
        .collection('directory').add({
            name: 'home',
            path: '',
            timestamp: new Date().toLocaleString()
        })

        // Add user's file in firebase storage
        ref = this.$fire.storage.ref(`users/${this.$fire.auth.currentUser.uid}/temp.tmp`)
        let file = new File(['tempFile'], 'temp.tmp')
        ref.put(file).then(snapshot => {
          console.log('Upload temp file')
        })

        await this.$fire.auth.signOut()
        await this.$router.push('login')
        //console.log(r)

      } catch (e) {
        console.error(e.message)
      }
    },

    // Do not use googleLogin in auth page (on Process)
    async googleLogin() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider()
        this.$fire.auth.languageCode = 'Korean'
        const r = await this.$fire.auth.signInWithPopup(provider)
        this.$store.commit('setUser', r.user)
        await this.$router.push('/')
      } catch (e) {
        console.error(e.message)
      }
    }
  }
}
</script>

<style scoped>

</style>
