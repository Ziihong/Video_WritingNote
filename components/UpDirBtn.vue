<template>
  <span class="btn">
    <v-btn color="primary" class="filebox">
      <label for="up-directory">
        <v-icon left>mdi-folder-upload-outline</v-icon>
        폴더 업로드
      </label>
      <v-file-input class="selectFile" id="up-directory" @change="upDirectory" v-model="fileNames" light
                    webkitdirectory
                    webkitRelativePath
                    mozdirectory
                    directory multiple/>
    </v-btn>
  </span>
</template>

<script>
export default {
  name: "UpDirBtn",
  props:{
    parentId: String,
  },
  data(){
    return{
      fileNames:'', // all sub files and dirs
      fileObj:'', // obj
      uploadDirectoryId:'',
    }
  },
  methods: {
    async upDirectory(){
      // create upload directory
      let theFiles = this.fileNames;
      let relativePath = theFiles[0].webkitRelativePath;
      let directory = relativePath.split("/");
      const dirName = directory[0];

      // can't upload using same directory name
      const sameRef = await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`)
        .collection('directories')
      const sameQuerySnap = await sameRef.where("parentId", "==", this.parentId).where('name', '==', dirName).get();
      if (sameQuerySnap.docs.length) {
        return alert('기존 항목이 존재합니다.');
      }

      // create upload directory
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`).collection('directories')
        .add({
          name: dirName,
          parentId: this.parentId,
        })
      const storageRef = await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`)
        .collection('directories');

      // set path for uploading files
      const querySnap = await storageRef.where("parentId", "==", this.parentId).where('name', '==', dirName).get();
      if (querySnap.docs.length) {
        this.uploadDirectoryId = querySnap.docs[0].id;
      }

      // upload file
      while(this.fileNames.length > 0){
        // console.log('function: upFile!');
        this.fileObj = this.fileNames.pop();
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

          //const docReference
          console.log("firebse upload");
          await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/files`).add({
            parentId: self.uploadDirectoryId,
            name: uploadTask.snapshot.ref.name,
            path: uploadTask.snapshot.ref.fullPath,
            timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
          })

          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
          });
        });
      }
    },
  },
}
</script>

<style scoped>
.filebox{
  display: inline-block;
  padding: .5em .75em;
  font-size: small;
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

.btn{
  margin: 0 10px 15px 0;
}
</style>
