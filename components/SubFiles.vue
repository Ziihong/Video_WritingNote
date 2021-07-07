<template>
  <v-col>
    <v-row> 파일 </v-row>
    <v-row>
      <template v-for="(file,index) of files" class="file">
          <div class="file">
            <video :src="`${fileUrls[index]}#t=0.5`" muted width="100%" @click="goFile(file)">{{ fileUrls[index] }}</video>
            <span @click="goFile(file)"> {{ file.data().name }}</span>
            <button>
              <v-icon right @click="modalOpen(file)">mdi-pen</v-icon>
            </button>
            <button>
              <v-icon right @click="removeFile(file)">mdi-close-box</v-icon>
            </button>
          </div>
      </template>
    </v-row>
    <modal
      :isModalViewed="this.isModalViewed"
      :title="'이름 바꾸기'"
      @modal-close="modalClose"
      @modal-ok="modalRename">
    </modal>
  </v-col>
</template>

<script>
import Modal from '~/components/Modal'
export default {
  props: {
    parentId: String,
  },
  data() {
    return {
      isModalViewed : false,
      files: [],
      fileUrls: [],
      renameFile:'', //obj
    }
  },
  mounted() {
    this.viewFiles();
  },
  methods: {
    viewFiles() {
      this.files = [];
        const fileStorageRef = this.$fire.firestore
          .collection(`users/${this.$fire.auth.currentUser.uid}/files`);
        fileStorageRef.orderBy('name').where('parentId', '==', this.parentId)
          .onSnapshot((async querySnapshot => {
            //console.log(querySnapshot.docs.length);
            this.files = querySnapshot.docs;
            const self = this;
            this.fileUrls = await Promise.all(this.files.map(file => file.data().path ? self.$fire.storage.ref(file.data().path).getDownloadURL() : ''));
            //console.log('fileUrls', this.fileUrls);
          }));
    },
    goFile(file){
      this.$router.push(`/videonotes/${file.id}`);
    },
    async removeFile(file){
      const delConfirm = confirm("파일을 완전히 삭제하시겠습니까?");
      if (delConfirm == true) {
        await this.$fire.firestore.doc(`users/${this.$fire.auth.currentUser.uid}/files/${file.id}`).delete();
      }
    },
    modalOpen(file){
      this.isModalViewed = true;
      this.renameFile = file;
    },
    async modalRename(rename){
      if (rename == undefined) {
        return alert("이름을 입력해주세요");
      }
      else {
        await this.$fire.firestore
          .doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.renameFile.id}`)
          .update({
            name: rename,
          });
        this.isModalViewed = false;
      }
    },
    modalClose(){
      this.isModalViewed = false;
    },
  }
}
</script>

<style scoped>
.file{
  display: inline;
  padding: 10px;
  margin: 10px;
  width: 350px;
  border-radius: 10px;
  border: solid 1px cornflowerblue;
}
</style>
