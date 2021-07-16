<template>
  <v-row>
    <v-col class="text-left">

      <div style="padding-top: 30px;background-color: white;color: black;">
        name: {{ name }}<br>description: {{ description }}
        <span>
          <v-text-field v-model="name" light/>
          <v-btn @click="onSave" v-html="`Save Name`" light/>
        </span>
      </div>

      <div style="margin-bottom: 10px">
        <v-text-field v-model="createDir" label="Directory name"></v-text-field>
        <v-btn @click="createDirectory">Create directory</v-btn>
        <v-btn @click="goHome">go Home Dir</v-btn>
        <v-btn @click="renameDirectory">rename current directory</v-btn>
      </div>

      <div style="background-color: lightcyan; margin-top: 10px" class="text-left">
        <v-btn text style="display: inline; min-width: 20%; text-transform: none" class="text-center">
          {{ 'storage/' }}
        </v-btn>
        <v-btn text style="display: inline;min-width: 20%; text-transform: none" class="text-center">
          {{ currentDir }}
        </v-btn>
      </div>
      <div class="text-left" style="margin-top: 10px">
        <v-list-item v-for="(dir,index) of dirs"
                     style="display: inline; background-color: #ced4da; margin-right: 5px"
                     v-bind:key = index
                     @click="clickDir(dir.name, dir.path)">
          <v-list-item-action class="fileShape">
            {{ dir.name }}
          </v-list-item-action>
        </v-list-item>
        <hr>
      </div>

      <div style="background-color: lightcyan; margin-top: 10px" class="text-center"> Files </div>
      <div class="text-left" style="margin-top: 10px">
        <v-btn class="addFilebtn" @click="dialog = !dialog">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-list-item v-for="(file,index) of files"
                     style="display: inline"
                     v-bind:key = index
                     @click="gotoEditVideo(file)">
          <v-list-item-action class="fileShape">
            <video :src="fileUrls[index]" width="200px"/>
            {{ file.data().title }}<br>
            <v-btn @click="$event.stopPropagation() ,removeFile(file)">Delete</v-btn>
          </v-list-item-action>
        </v-list-item>
        <hr>
      </div>

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
            <v-btn @click="dialog = false" color="primary">
              Cancel
            </v-btn>
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

      uid: null,
      currentDir: null,
      currentDirName: null,
      currentDirPath: null,
      createDir: null,

      dirLog: [],
      dirs: [],
      docFiles: []
    };
  },

  mounted() {
    if(!this.$fire.auth.currentUser)
      return;

    // set current uid & current Directory path
    this.uid = this.$fire.auth.currentUser.uid
    this.currentDir = this.$route.params.dir
    this.currentDirName = this.$route.params.name
    this.currentDirPath = this.$route.params.path

    // if user in home directory
    if (this.currentDir == undefined) {
      this.currentDir = '/';
      this.currentDirName = 'home';
      this.currentDirPath = '/';
    }

    // get user name
    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name;
        this.description = docSnap.data().description;
      }
      else {
        console.log('not exists');
      }
    });

    this.updateData();
  },

  methods: {
    // Fetch data from fire store
    async updateData() {
      // get user's directory
      this.$fire.firestore.doc(`users/${this.uid}`)
        .collection('directory').onSnapshot((async querySnapshot =>{
          console.log('Now directory update');
          // reset dirs and files
          this.dirs = [];
          querySnapshot.docs.forEach(dir => {
            if (dir.data().path === this.currentDir) {
              //console.log(dir.data().name);
              this.dirs.push(dir.data())
            }
          })
        }));
      // end directory get

      // get user's file
      this.$fire.firestore.doc(`users/${this.uid}`)
        .collection('files').onSnapshot((async querySnapshot =>{
        console.log('Now file update');
        // reset dirs and files
        this.docFiles = [];
        this.files = [];
        querySnapshot.docs.forEach(file => {
          if (file.data().path === this.currentDir) {
            this.files.push(file);
            this.docFiles.push(file.data());
          }
        })
        // update video urls
        const self = this
        this.fileUrls = await Promise.all(this.files.map(file =>
          file.data().source ? self.$fire.storage.ref(file.data().source).getDownloadURL() : ''));
        console.log('fileUrls', this.fileUrls)
      }));
      // end file get
    },
    // method for adding video on screen
    addVideo(){
      const src= this.fileObj;
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
    // routing with file id value
    async gotoEditVideo(file){
      await this.$router.push('/editVideo/' + file.id);
    },
    // Save Name for account
    async onSave() {

      this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`).
      set({name: this.name}, {merge: true}).
      then(() => {
        console.log('saved!');
      });

    },
    // Remove files on fire store
    async removeFile(file) {
      console.log('file: ', file.id);
      console.log('source', file.data().source);
      await this.$fire.storage.ref(file.data().source).delete();
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${file.id}`).delete();
    },
    // Set file object for selected one
    onSelect(file) {
      console.log('onSelect:', file);
      this.fileObj = file;
    },
    // Upload file on fire store and storage
    startUpload(title){
      if(!this.$fire.auth.currentUser) {
        return alert('로그인해주세요.');
      }

      if(!this.fileObj) {
        return alert('파일을 선택해주세요.');
      }

      // set file's field data before uploading
      const name = this.fileObj.name;
      const currentDir = this.currentDir

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

        // add file on firestore
        await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/files`).add({
          title: title,
          name: name,
          path: currentDir,
          source: uploadTask.snapshot.ref.fullPath,
          timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
        })
        this.isUploading = false;

        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
      });
    },

    // Create lower directory
    async createDirectory() {

      if (this.createDir == null) {
        console.log('Input your directory name');
        return;
      }

      try {
        const docRef = this.$fire.firestore.collection(`users/${this.uid}/directory`);
        console.log(docRef[0])

        await docRef.add({
        name: this.createDir, path: this.currentDir, timestamp: new Date().toLocaleString() });

        await this.$router.push({ params: { dir: this.currentDir }});

      } catch (e) {
        console.log(e.message);
      }
    },

    // Renaming current directory
    async renameDirectory() {
      // Use this.createDir input box
      if (this.createDir == null) {
        console.log('Input your directory name');
        return;
      }

      // If user change home dir name
      if (this.currentDir == '/') {
        console.log('Can not change home directory name');
        return;
      }

      try {
        const collection = this.$fire.firestore.collection(`users/${this.uid}/directory`);

        // Change current dir name
        collection.where("name", "==", this.currentDirName).where("path", "==", this.currentDirPath)
        .get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const batch = this.$fire.firestore.batch();
            const docRef = collection.doc(doc.id);
            batch.set(docRef, { "name": this.createDir }, { merge: true });
            batch.commit();
          })
        })

        // Change dirs path which in current dir
        collection.where("path", ">=", this.currentDir).where("path", "<=", this.currentDir + "~")
        .get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const batch = this.$fire.firestore.batch();
            const docRef = collection.doc(doc.id);
            batch.set(docRef, { "path": this.currentDirPath + this.createDir + '/' }, { merge: true });
            batch.commit();
          })
        });

        this.clickDir(this.createDir, this.currentDirPath);

      } catch (e) {
        console.log(e.message);
      }
    },

    // Go to home directory
    async goHome() {
      if (this.currentDir == '/') { // if not, caused error
        return
      }
      await this.$router.push({ params: {dir: '/', name: 'home', path: '/' }})
    },

    // Go to clicked directory
    async clickDir(name, path) {
      await this.$router.push({ params: {dir: path + name + '/', name: name, path: path }})
    },
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
  max-width: 200px;
  margin: 0px;
  text-align: center;
}
</style>
