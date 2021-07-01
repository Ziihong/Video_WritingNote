<template>
  <div>
    name: {{ this.name }}
    <template v-for="(file, index) of files">
      <li v-if="file.data.path">
        <v-img :src="fileUrls[index]"/>
      </li>
      <li v-else>{{ file.data().name }}</li>
    </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      name: null,
      files: [],
      fileUrls: [],
    }
  },

  mounted() {
    if(!this.$fire.auth.currentUser)
      return

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`)
    .get().then(docSnap => {
      if (docSnap.exists) {
        this.name = docSnap.data().name
      }
      else {
        console.log('not exists')
      }
    })

    this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}`)
    .collection('files').orderBy('name').onSnapshot((async querySnapshot => {
      console.log(querySnapshot.docs.length)
      this.files = querySnapshot.docs
      const self = this
      this.fileUrls = await Promise.all(this.files.map(file =>
      file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''))
      console.log('fileUrls', this.fileUrls)
    }))
  }
}
</script>
