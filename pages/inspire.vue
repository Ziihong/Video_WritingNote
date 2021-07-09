<template>
  <v-row>
    <v-col class="text-center">
      <v-spacer></v-spacer>
      <v-btn>Create directory</v-btn>
      <div class="text-left">
        <v-btn class="addFilebtn" @click="dialog = !dialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-list-item v-for="(file,index) of files"
                     style="display: inline"
                     @click="gotoEditVideo(file)">
          <v-list-item-action v-if="file.data().path" class="fileShape">
            <video :src="fileUrls[index]" width="200px"/>
            {{ file.data().title }}
          </v-list-item-action>
          <v-list-item-action v-else>{{ file.data().title }}</v-list-item-action>
        </v-list-item>
        <hr>
      </div>

      <!--check below code for add/remove file collection & file upload-->
      <div style="padding: 30px;background-color: white;color: black;">
        name: {{ name }}<br>
        description: {{ description }}
        <v-text-field v-model="name" light/>
        <v-btn @click="onSave" v-html="`저장`" light/>
      </div>
      <!-- End of file management Example-->

      <v-dialog v-model="dialog" width="500" v-if="dialog">
        <v-card style="background-color: lightgray">
          <v-card-text class="text-center" >
            <v-file-input id="inputVideo" accept=".mp4" label="File input"
                          style="background-color: lightgray"
                          messages="﹣ Only MP4 format allowed"
                          @change="onSelect">
            </v-file-input>
            <v-text-field id="inputVideoTitle"
                          style="background-color: lightgray; padding-left: 7%"
                          placeholder="Default title will be file's name"></v-text-field>
            <hr class="my-3">
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              id ="addBtn"
              color="primary"
              @click="addVideo"
            >
              Add Video
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data(){
    return{
      dialog: false,
      description: '',
      name: '',
      files: [],
      fileObj: null,
      isUploading: false,
      fileUrls: [],
    };
  },

  //check below code for file handling
  mounted() {
    if(!this.$fire.auth.currentUser)
      return;

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name;
        this.description = docSnap.data().description;
      }

      else {
        console.log('');
      }
    });

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
    collection('files').orderBy('name').onSnapshot((async querySnapshot => {
      console.log(querySnapshot.docs.length);
      this.files = querySnapshot.docs;
      const self = this;

      console.log('this',this);

      this.fileUrls = await Promise.all(this.files.map(file => file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''));

      console.log('fileUrls', this.fileUrls);
    }));
  },

  methods: {
    // method for adding video on screen
    addVideo(){
      const src= document.getElementById('inputVideo').files[0];
      let title = document.getElementById('inputVideoTitle').value;
      if(src){
        if(!title){
          title = src.name;
        }
        this.startUpload(title);
        this.dialog = false;
      }
      else{
        return alert('No video file!');
      }
    },

    async gotoEditVideo(file){ // routing with file id value
      await this.$router.push('/editVideo/' + file.id);
    },

    // Fire store example methods
    async onSave() {
      // this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).update({name: this.name}).then(() => {
      //   console.log('saved!');
      // })
      this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
      set({name: this.name}, {merge: true}).
      then(() => {
        console.log('saved!');
      });

      await this.$fire.firestore.collection(`users/${this.$fire.auth.currentUser.uid}/files`).
      add({name: `test${this.files.length}`, title: `test${this.files.length}`});
    },

    async removeFile(file) {
      console.log('file: ', file.id);
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${file.id}`).delete();
    },

    onSelect(file) {
      console.log('onSelect:', file);
      this.fileObj = file;
    },

    startUpload(title){
      if(!this.$fire.auth.currentUser) {
        return alert('로그인해주세요.');
      }

      if(!this.fileObj) {
        return alert('파일을 선택해주세요.');
      }

      const storageRef =
        this.$fire.storage.ref(`users/${this.$fire.auth.currentUser.uid}/${title}/${this.fileObj.name}`);
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
          title: title,
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
}
</script>

<style>
.addFilebtn{
  min-height: 160px;
  width: 140px;
  border-style: dashed;
}

.fileShape{
  max-height: 200px;
  margin: 0px;
}
</style>
