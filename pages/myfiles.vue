<template>
  <div>
    <v-col>
      <v-row>
        <div>
          path: {{ path }}
        </div>
      </v-row>
      <v-row>
    <form>
      <!-- upload directory button -->
      <v-btn color="primary" class="filebox">
        <label for="up-directory">
          <v-icon left>mdi-folder-upload-outline</v-icon>
          폴더 업로드
        </label>
        <v-file-input class="selectFile" id="up-directory" @change="onSelectDir" v-model="name" light webkitdirectory
                      directory multiple/>
      </v-btn>
      <!-- upload file button -->
      <v-btn color="primary" class="filebox">
        <label for="up-file">
          <v-icon left>mdi-file-upload-outline</v-icon>
          파일 업로드
        </label>
        <v-file-input class="selectFile" id="up-file" @change="onSelect" v-model="name" light/>
      </v-btn>
      <!-- make new directory -->
      <v-btn color="primary" class="filebox" @click="newDirectory">
        <v-icon left>mdi-folder-plus-outline</v-icon>
        새폴더
      </v-btn>
      <input type="text" @change="newDirectory">
    </form>
      </v-row>
    <!-- View Directories -->
      <v-row>
    <template v-for="dir of directories">
      <div class="directory">
        <v-icon left>mdi-folder</v-icon>
        <span @click="moveDir(dir)">{{ dir.data().name }}</span>
        <button @click="removeDirectory(dir)">
          <v-icon right>mdi-close-box</v-icon>
        </button>
      </div>
    </template>
      </v-row>
    <!-- View Files -->
      <v-col>
    <template v-for="file of files">
      <li>
        <span @click="movePage">{{ file.data().name }}</span>
        <button @click="removeFile(file)">
          <v-icon right>mdi-close-box</v-icon>
        </button>
      </li>
    </template>
        </v-col>
    <!-- function test button -->
    </v-col>
    <v-btn color="primary" @click="getKey">click</v-btn>
  </div>
</template>

<script>
import Auth from '~/components/Auth';

export default {
  components: {
    Auth
  },
  data() {
    return {
      name: '',
      files: [],
      directories: [],
      fileObj: null,
      isUploading: false,
      fileUrls: [],
      path: `users/${this.$fire.auth.currentUser.uid}/files`,
    };
  },
  async mounted() {
    if (!this.$fire.auth.currentUser) {
      return;
    }
    this.path = `users/${this.$fire.auth.currentUser.uid}`
    this.$fire.firestore.doc(this.path).get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name;
      } else {
        console.log('');
      }
    })
    this.$fire.firestore.doc(this.path).collection('files').orderBy('name').onSnapshot((async querySnapshot => {
      console.log(querySnapshot.docs.length);
      this.files = querySnapshot.docs;
      const self = this;
      this.fileUrls = await Promise.all(this.files.map(file => file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''));
      console.log('fileUrls', this.fileUrls);
    }));
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).collection('directories').orderBy('name').onSnapshot((async querySnapshot => {
      //console.log(querySnapshot.docs.length);
      this.directories = querySnapshot.docs;

      const self = this;
      this.fileUrls = await Promise.all(this.files.map(file => file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''));
      console.log('fileUrls', this.fileUrls);
    }));
  },
  methods: {
    getKey(){
      const len = 21;
      const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let key = '';
      for ( let i = 0; i < len; i++ ) {
        key += characters.charAt(Math.floor(Math.random() *
          charactersLength));
      }
      return key;
    },
    moveDir(dir){
      this.path += `/${dir.id}`;
      const path = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/directories/${dir.id}`)
      path.get().then(docSnap => {
        if (docSnap.exists) {
          this.name = docSnap.data().name;
        } else {
          console.log('');
        }
      })
      // view
      path.collection(dir.id).orderBy('name').onSnapshot((async querySnapshot => {
        //console.log(querySnapshot.docs.length);
        this.directories = [];
        this.files = querySnapshot.docs;

        const self = this;
        this.fileUrls = await Promise.all(this.directories.map(dir => dir.data().path ? self.$fire.storage.ref(dir.data().path).getDownloadURL() : ''));
        console.log('fileUrls', this.fileUrls);
      }));

      console.log('move dir');
      // console.log(path);
    },
    movePage() {
      this.$router.push('/mypage');
    },
    async newDirectory() {
      console.log('New Dir!!!');
      let storageRef = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`).collection('directories')

      const docID = `newDirectory${this.directories.length + 1}`;
      storageRef = storageRef.doc(docID)
      storageRef.set({name: docID});

      storageRef.collection(docID).add({timestamp: this.$fireModule.firestore.FieldValue.serverTimestamp()});

    },
    async removeDirectory(dir) {
      //console.log(this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/directories/${dir.id}`));
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/directories/${dir.id}`).delete();
    },
    async removeFile(file) {
      // console.log('file: ', file);
      // console.log(file.data().name);
      const ex = this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${file.id}`);
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${file.id}`).delete();
      const storageRef = this.$fire.storage.ref(file.data().name);
      console.log('storageRef:', storageRef);
      storageRef.delete().then(function () {
        console.log('delete!');
      }).catch(function (error) {
        alert('error');
      });
    },
    onSelectDir(files) {
      console.log(files.name);
      console.log(files);
      return 0;
    },
    onSelect(file) {
      console.log('file:', file);
      this.fileObj = file;
      console.log('fileObj:', this.fileObj);
      if (!this.$fire.auth.currentUser) {
        return alert('로그인해주세요.');
      }
      if (!this.fileObj) {
        return alert('파일을 선택해주세요.');
      }
      const storageRef = this.$fire.storage.ref(`users/${this.$fire.auth.currentUser.uid}/${this.fileObj.name}`);
      console.log('storageRef:', storageRef);
      console.log('fileObj.name:', this.fileObj.name);
      storageRef.put(this.fileObj);
      const uploadTask = storageRef.put(this.fileObj);
      this.isUploading = true;
      const self = this;
      uploadTask.on('state_changed', async function (snapshot) {        // Observe state change events such as progress, pause, and resume
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
      }, function (error) {
        // Handle unsuccessful uploads
        alert('error');
        this.isUploading = false;
      }, async function () {
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

        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
        });
      });
    }
  }
}
</script>

<style scoped>
.filebox label {
  display: inline-block;
  padding: .5em .75em;
  font-size: inherit;
  line-height: normal;
  vertical-align: middle;
  cursor: pointer;
}

/* 파일 필드 숨기기 */
.selectFile {
  position: absolute;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.directory{
  display: inline;
  padding: 10px;
  margin:10px;
  border-radius: 10px;
  border: solid 2px cornflowerblue;
}


</style>
