<template>
  <div>
    name: {{ this.name }}
    <v-btn @click="uploadFile">upload file</v-btn>
    <v-form>
      <v-text-field v-model="createDir.name" label="Directory name"></v-text-field>
      <v-text-field v-model="createDir.path" label="Directory path"></v-text-field>
    </v-form>
    <v-btn @click="createDirectory">create Directory</v-btn>

    <template v-for="(file, index) of files">
      <li v-if="file.data.path">
        <v-img :src="fileUrls[index]"/>
      </li>
      <li v-else>{{ file.data().name }}</li>

      <br>
      <div> Directory </div>
      <br>

      <li v-for="dir in dirs" @click="clickDir(dir.name, dir.path)">
        {{ dir.name }} . {{ dir.path }}
        <router-view :key="$route.fullPath"/>
      </li>

      <router-link to="/storage" v-for="dir in dirs"> {{ dir.name }} </router-link>
      <router-view :key="$route.fullPath"></router-view>
    </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      name: null,
      uid: null,
      files: [],
      fileUrls: [],

      createDir: {
        name: null,
        path: null
      },

      dirs: []
    }
  },

  created() {
    if(!this.$fire.auth.currentUser)
      return

    let queryDir = this.$route.query.dir

    // if user in home directory
    if (queryDir == undefined) {
      queryDir = '/'
    }
    console.log(queryDir)
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

    // get user's directory
    this.$fire.firestore.doc(`users/${this.uid}`)
    .collection('directory').get().then(directory => {
      directory.docs.forEach(dir => {
        if (dir.data().path === queryDir) {
          this.dirs.push(dir.data())
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
      console.log('fileUrls', this.fileUrls)
    }))
  },

  methods: {
    async createDirectory() {
      try {
        await this.$fire.firestore.collection(`users/${this.uid}/directory`)
          .doc(this.createDir.path.replace('\/','').replace(/\//g,'.') + this.createDir.name)
          .set({ name: this.createDir.name , path: this.createDir.path })

      } catch (e) {
        console.log(e.message)
      }
    },

    async uploadFile() {
      console.log(this.$route.query)
    },

    async clickDir(name, path) {
      await this.$router.push({ query: {dir: path + name + '/'}})
      //await this.$router.push({path: this.$route.path, query: {dir: path + name + '/'}})
    }
  }
}
</script>
