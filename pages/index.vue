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

        <template v-for="(file,index) of files">
          <li v-if="file.data().path" @click="removeFile(file)" >
            <v-img :src="fileUrls[index]" />
          </li>
          <li v-else @click="removeFile(file)" >{{ file.data().name }}</li>
        </template>
        <hr>
        <h3>파일 업로드</h3>
        <v-file-input
          truncate-length="15"
          label="파일선택" color="red" @change="onSelect"/>
        <v-btn @click="startUpload" v-html="'업로드'" />
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
      fileObj: null,
      isUploading: false,
      fileUrls: [],
    };
  },
  mounted() {
    if(!this.$fire.auth.currentUser)
      return;
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name;
        this.description = docSnap.data().description;
      } else {
        console.log('');
      }
    });
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
    collection('files').orderBy('name').onSnapshot((async querySnapshot => {
      console.log(querySnapshot.docs.length);
      this.files = querySnapshot.docs;
      const self = this;
      this.fileUrls = await Promise.all(this.files.map(file => file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''));
      console.log('fileUrls', this.fileUrls);
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
    },
    onSelect(file) {
      console.log('onSelect:', file);
      this.fileObj = file;
    },
    startUpload(){
      if(!this.$fire.auth.currentUser) {
        return alert('로그인해주세요.');
      }
      if(!this.fileObj) {
        return alert('파일을 선택해주세요.');
      }
      const storageRef = this.$fire.storage.ref(`users/${this.$fire.auth.currentUser.uid}/${this.fileObj.name}`);
      const uploadTask = storageRef.put(this.fileObj);
      this.isUploading = true;
      const self = this;
      uploadTask.on('state_changed', async function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case self.$fireModule.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case self.$fireModule.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
        alert('error');
        this.isUploading = false;
      }, async function() {
        console.log('success!');
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        console.log(uploadTask.snapshot.ref.fullPath);

        await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/files`).add({
          name: uploadTask.snapshot.ref.fullPath,
          path: uploadTask.snapshot.ref.fullPath,
          timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
        })
        this.isUploading = false;

        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
      });

    }
  },
};
</script>
