<template>
  <div>
    name: {{ this.name }}
    <br><br>
    <v-btn @click="uploadFile">upload file</v-btn>
    <v-form>
      <v-text-field v-model="createDir" label="Directory name"></v-text-field>
    </v-form>
    <v-btn @click="createDirectory">create Directory</v-btn>
    <v-btn @click="goHome">go Home Dir</v-btn>

    <br><br>
    <div> Files </div>

    <li v-for="file in docFiles" v-bind:key="file.name"> {{ file.name }} </li>

    <br>
    <div> Directory </div>

    <li v-for="dir in dirs" v-bind:key="dir.name" @click="clickDir(dir.name, dir.path)"> {{ dir.name }} </li>

  </div>
</template>

<script>
export default {
  data() {
    return {
      name: null,
      uid: null,
      currentDir: null,
      files: [],
      fileUrls: [],

      createDir: null,

      dirs: [],
      docFiles: []
    }
  },

  mounted() {
    if(!this.$fire.auth.currentUser)
      return

    this.currentDir = this.$route.params.dir

    // if user in home directory
    if (this.currentDir == undefined) {
      this.currentDir = '/'
    }
    this.uid = this.$fire.auth.currentUser.uid

    // get user name
    this.$fire.firestore.doc(`users/${this.uid}`)
      .get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name
      }
      else {
        console.log('not exists')
      }
    });

    this.updateData();

  },

  methods: {
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
            //console.log(file.data().name);
            this.files.push(file);
            this.docFiles.push(file.data());
          }
        })
      }));
      // end file get

      // update video urls
      const self = this
      this.fileUrls = await Promise.all(this.files.map(file =>
        file.data().source ? self.$fire.storage.ref(file.data().source).getDownloadURL() : ''));
      //console.log('fileUrls', this.fileUrls)

      // this.$fire.firestore.doc(`users/${this.uid}`)
      //   .collection('files').orderBy('name').onSnapshot((async querySnapshot => {
      //   //console.log(querySnapshot.docs.length)
      //   this.files = querySnapshot.docs
      //   const self = this
      //   this.fileUrls = await Promise.all(this.files.map(file =>
      //     file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''))
      //   //console.log('fileUrls', this.fileUrls)}
    },

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

    async uploadFile() {
      //console.log(this.$route.query)
    },

    async goHome() {
      if (this.currentDir == '/') { // if not, caused error
        return
      }
      await this.$router.push({ params: {dir: '/' }})
    },

    async clickDir(name, path) {
      await this.$router.push({ params: {dir: path + name + '/' }})
      console.log(this.$route.params)

    }
  }
}
</script>

<style scoped>

</style>
