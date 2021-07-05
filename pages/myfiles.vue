<template>

  <v-col>
    <!-- directory path -->
    <v-col>
      <span v-for="path of pathIds"> > <v-btn @click="movePath(path)"> {{ path.pathName }} </v-btn> </span>
    </v-col>

    <!-- buttons container -->
    <v-col>
      <!-- button : make new directory -->
      <v-row class="btnContainer">
        <div class="btn">
          <v-btn color="primary" class="filebox" @click="makeDirectory">
            <v-icon left>mdi-folder-plus-outline</v-icon>
            새폴더
          </v-btn>
          <v-text-field clearable placeholder="새폴더 이름을 입력하세요" v-model="newName"/>
        </div>
      </v-row>

      <!-- upload buttons container -->
      <v-row class="btnContainer">
        <!-- button: upload directory -->
        <div class="btn">
          <v-btn color="primary" class="filebox">
            <label for="up-directory">
              <v-icon left>mdi-folder-upload-outline</v-icon>
              폴더 업로드
            </label>
            <v-file-input class="selectFile" id="up-directory" @change="upDirectory" v-model="name" light
                          webkitdirectory
                          directory multiple/>
          </v-btn>
        </div>
        <!-- button : upload file -->
        <div class="btn">
          <v-btn color="primary" class="filebox">
            <label for="up-file">
              <v-icon left>mdi-file-upload-outline</v-icon>
              파일 업로드
            </label>
            <v-file-input class="selectFile" id="up-file" @change="upFile" v-model="name" light/>
          </v-btn>
        </div>
      </v-row>
    </v-col>

    <!-- view directories -->
    <v-col>
      <v-row>
        <div>폴더</div>
      </v-row>
      <v-row>
        <template v-for="dir of directories">
          <div class="directory">
            <div class="inlineBtn" @click="moveDirectory(dir)">
              <v-icon left>mdi-folder</v-icon>
              <span>{{ dir.data().name }}</span>
            </div>
            <button class="inlineBtn">
              <v-icon right @click="removeDirectory(dir)">mdi-close-box</v-icon>
            </button>
          </div>
        </template>
      </v-row>
    </v-col>

    <!-- view files -->
    <v-col>
      <v-row>
        <div>파일</div>
      </v-row>

      <v-row>
        <template v-for="(file,index) of files">
          <div class="videoFile">
            <span @click="moveFile(file)">
            <video :src="`${fileUrls[index]}#t=0.5`" muted width="100%">{{ fileUrls[index] }}</video>
            <span> {{ file.data().name }}</span>
            </span>
            <button class="inlineBtn">
              <v-icon right @click="removeFile(file)">mdi-close-box</v-icon>
            </button>
          </div>
        </template>
      </v-row>
    </v-col>

  </v-col>
</template>

<script>
import Auth from '~/components/Auth';

export default {
  components: {
    Auth,
  },
  data() {
    return {
      name: '',
      newName: '',
      path: '',
      directories: [],
      files: [],
      currentDirectory: '',
      fileObj: null,
      isUploading: false,
      fileUrls: [],
      pathIds: [
        {
          pathId: '',
          pathName: '내 보관함',
          parentId: '',
        }
      ],
    }
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
    this.viewFiles();
  },
  methods: {
    viewFiles() {
      // view directories
      this.directories = [];
      const dirStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`);
      dirStorageRef.orderBy('name').where('parentId', '==', this.currentDirectory)
        .onSnapshot((async querySnapshot => {
          this.directories = querySnapshot.docs;
        }));

      // view files
      this.files = [];
      const fileStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/files`);
      fileStorageRef.orderBy('name').where('parentId', '==', this.currentDirectory)
        .onSnapshot((async querySnapshot => {
          //console.log(querySnapshot.docs.length);
          this.files = querySnapshot.docs;
          const self = this;
          this.fileUrls = await Promise.all(this.files.map(file => file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''));
          console.log('fileUrls', this.fileUrls);
        }));
    },
    async movePath(path) {
      // console.log(path);
      // if user clicks '내 보관함'
      if (path.pathId == '') {
        this.currentDirectory = '';
        this.pathIds = [
          {
            pathId: '',
            pathName: '내 보관함',
            parentId: '',
          }
        ];
        this.viewFiles();
        return;
      }

      // if else user clicks other path
      await this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`)
        .doc(path.pathId)
        .get().then((doc) => {
          if (doc.exists) {
            this.moveDirectory(doc);
          }
        });
    },
    async moveDirectory(dir) {
      //console.log(dir.id);
      this.currentDirectory = dir.id;
      this.pathIds = [];
      let tempPathIds = [];

      while (true) {
        // console.log('Start loop');
        tempPathIds.push({pathId: dir.id, pathName: dir.data().name, parentId: dir.data().parentId});
        let pid = dir.data().parentId;
        if (pid == '') {
          break;
        }

        await this.$fire.firestore
          .collection(`users/${this.$fire.auth.currentUser.uid}/directories`)
          .doc(pid)
          .get().then((doc) => {
            if (doc.exists) {
              dir = doc;
            }
          });
      }
      // console.log('End loop');
      tempPathIds.push({pathId: '', pathName: '내 보관함', parentId: ''});
      for (let i = tempPathIds.length - 1; i >= 0; i--) {
        this.pathIds.push(tempPathIds[i]);
      }
      this.viewFiles();
    },
    moveFile(file){
      //console.log(file);
      this.$router.push(`/videonotes/${file.id}`);
    },
    async makeDirectory() {
      if (!this.newName?.length) {
        return alert("폴더명을 입력해주세요");
      }

      // if it is same name directory in same path, user can't make directory for newName.
      const sameRef = await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`)
        .collection('directories')
      const querySnap = await sameRef.where("parentId", "==", this.currentDirectory).where('name', '==', this.newName).get();
      if (querySnap.docs.length) {
        return alert("이미 존재하는 폴더명입니다. 다른 이름을 입력하세요.");
      }
      await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`).collection('directories')
        .add({
          name: this.newName,
          parentId: this.currentDirectory
        })
      this.newName = '';
      alert("폴더가 생성되었습니다.");
      this.viewFiles();
    },
    upDirectory() {
      return;
    },
    upFile(file) {
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

        //const docReference
        await self.$fire.firestore.collection(`users/${self.$fire.auth.currentUser.uid}/files`).add({
          parentId: self.currentDirectory,
          name: self.fileObj.name,
          path: uploadTask.snapshot.ref.fullPath,
          timestamp: self.$fireModule.firestore.FieldValue.serverTimestamp()
        })

        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
        });
      });
    },
    async removeDirectory(dir) {
      const delConfirm = confirm("폴더와 하위 항목들을 완전히 삭제하시겠습니까?");
      if (delConfirm == true) {
        let subDirectories = [dir.id];
        let subFiles = [];

        // delete sub directories
        while (subDirectories.length != 0) {
          console.log("Start loop");
          let currentId = subDirectories.pop();
          // console.log("currentID:", currentId);
          // console.log("currentList:", subDirectories);
          await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/directories/${currentId}`).delete();
          const dirStorageRef = await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`)
            .collection('directories');
          await dirStorageRef.where("parentId", "==", currentId).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                subDirectories.push(doc.id);
                console.log(doc.id, doc.data().name);
              });
            });
          const fileStorageRef = await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/`)
            .collection('files');
          await fileStorageRef.where("parentId", "==", currentId).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                subFiles.push(doc.id);
              });
            });
        }

        // delete sub files
        for (let i = 0; i < subFiles.length; i++) {
          await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${subFiles[i]}`).delete();
        }
        //console.log("end loop");
        this.viewFiles();
      }
    },
    async removeFile(file) {
      //console.log(file);
      const delConfirm = confirm("파일을 완전히 삭제하시겠습니까?");
      if (delConfirm == true) {
        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${file.id}`).delete();
        alert("파일이 삭제되었습니다.");
        this.viewFiles();
      }
    }
  },
}

</script>

<style scoped>
.btn {
  margin-right: 10px;
}

.inlineBtn {
  display: inline;
}

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

.btnContainer {
  margin-bottom: 5px;
}

.directory {
  display: inline-block;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  border: solid 2px cornflowerblue;
}

.videoFile {
  display: inline;
  padding: 10px;
  margin: 10px;
  width: 350px;
  border-radius: 10px;
  border: solid 2px cornflowerblue;
}

</style>
