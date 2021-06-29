<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo/>
        <vuetify-logo/>
      </div>
      <Auth/>
      <div style="padding: 30px;background-color: white;color: black;">
        name: {{ name }}<br>
        description: {{ description }}
        <v-text-field v-model="name" light/>
        <v-btn @click="onSave" v-html="`저장`" light/>

        <template v-for="file of files">
          <li @click="removeFile(file)" >{{ file.data().name }}</li>
        </template>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue';
import VuetifyLogo from '~/components/VuetifyLogo.vue';
import Auth from '~/components/Auth';

export default {
  components: {
    Logo,
    VuetifyLogo,
    Auth,
  },
  data() {
    return {
      description: '',
      name: '',
      files: [],
    };
  },
  mounted() {
    console.log('USER UID: ', this.$fire.auth.currentUser.uid);
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name;
        this.description = docSnap.data().description;
      } else {
        console.log('');
      }
    });
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
    collection('files').orderBy('name').onSnapshot((querySnapshot => {
      console.log(querySnapshot.docs.length);
      this.files = querySnapshot.docs;
    }));
  },
  methods: {
    async onSave() {
      // this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).update({name: this.name}).then(() => {
      //   console.log('saved!');
      // })
      this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
      set({name: this.name}, {merge: true}).
      then(para => {
        console.log('Save test : '+para);
      });

      await this.$fire.firestore.collection(`users/${this.$fire.auth.currentUser.uid}/files`).
      add({name: `test${this.files.length}`});
    },
    async removeFile(file) {
      console.log('file: ', file.id);
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${file.id}`).delete();
    }
  },
};
</script>
