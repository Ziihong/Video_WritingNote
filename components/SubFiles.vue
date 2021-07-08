<template>
  <v-col>
    <v-row> 파일 </v-row>
    <v-row>
      <template v-for="(file,index) of files">
          <div class="file-wrap">
            <video :src="`${fileUrls[index]}#t=0.5`" muted width="100%" @click="goFile(file)">{{ fileUrls[index] }}</video>
            <div class="title-wrap"><span @click="goFile(file)"> {{ file.data().name }}</span></div>
            <div class="button-wrap">
            <button>
              <v-icon @click="renameModalOpen(file)">mdi-pen</v-icon>
            </button>
            <button>
              <v-icon @click="moveModalOpen(file)">mdi-swap-horizontal</v-icon>
            </button>
            <button>
              <v-icon @click="removeFile(file)">mdi-close-box</v-icon>
            </button>
            </div>
          </div>
      </template>
    </v-row>
    <ModalRename v-if="this.isRename"
      :isShowed="this.isRename"
      :title="'이름 바꾸기'"
      @rename-close="renameModalClose"
      @rename-ok="renameModalOk">
    </ModalRename>
    <ModalMove v-if="this.isMove"
      :isShowed="this.isMove"
      @move-close="moveModalClose"
      @move-ok="moveModalOk">
    </ModalMove>
  </v-col>
</template>

<script>
import ModalRename from "/components/ModalRename";
import ModalMove from "/components/ModalMove";

export default {
  components: {
    ModalRename,
    ModalMove,
  },
  props: {
    parentId: String,
  },
  data() {
    return {
      isRename: false,
      isMove: false,
      files: [],
      fileUrls: [],
      renameFile: '', //obj
      moveFile: '',
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
    moveModalOpen(file){
      this.isMove = true;
      this.moveFile = file;
    },
    moveModalClose(){
      this.isMove = false;
    },
    async moveModalOk(dir){
      this.isMove = false;
      const selectDirectory = dir;
      await this.$fire.firestore
        .doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.moveFile.id}`)
        .update({
          parentId: selectDirectory.id,
        });
    },
    renameModalOpen(file){
      this.isRename = true;
      this.renameFile = file;
    },
    renameModalClose(){
      this.isRename = false;
    },
    async renameModalOk(rename){
      await this.$fire.firestore
        .doc(`users/${this.$fire.auth.currentUser.uid}/files/${this.renameFile.id}`)
        .update({
          name: rename,
        });
      this.isRename = false;
    },
  }
}
</script>

<style scoped>
.file-wrap{
  display: inline;
  padding: 10px;
  margin: 10px;
  width: 280px;
  border-radius: 10px;
  border: solid 1px cornflowerblue;
}
.title-wrap{
  display:inline-block;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  width:160px;
}
.button-wrap{
  display: inline-block;
  float:right;
}
</style>
