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

  created() {
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
    })

    this.updateData()

  },

  methods: {
    async updateData() {
      // reset dirs and files
      this.dirs = []
      this.files = []

      // get user's directory
      this.$fire.firestore.doc(`users/${this.uid}`)
        .collection('directory').get().then(directory => {
        directory.docs.forEach(dir => {
          if (dir.data().path === this.currentDir) {
            this.dirs.push(dir.data())
          }
        })
      })

      // get user's file
      this.$fire.firestore.doc(`users/${this.uid}`)
      .collection('files').get().then(files => {
        files.docs.forEach(file => {

          if (file.data().path === this.currentDir) {
            this.docFiles.push(file.data())
          }
        })
      })

      this.$fire.firestore.doc(`users/${this.uid}`)
        .collection('files').orderBy('name').onSnapshot((async querySnapshot => {
        //console.log(querySnapshot.docs.length)
        this.files = querySnapshot.docs
        const self = this
        this.fileUrls = await Promise.all(this.files.map(file =>
          file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''))
        //console.log('fileUrls', this.fileUrls)
      }))
    },

    async createDirectory() {
      
      if (this.createDir == null) {
        console.log('Input your directory name')
        return
      }

      try {
        await this.$fire.firestore.collection(`users/${this.uid}/directory`)
          .doc(this.currentDir.replace('\/','').replace(/\//g,'.') + this.createDir)
          .set({ name: this.createDir, path: this.currentDir })

        this.updateData()

        await this.$router.push({ params: { dir: this.currentDir }})

      } catch (e) {
        console.log(e.message)
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
      await console.log(this.$route.params)

    }
  }
}
</script>

<style scoped>

</style>
