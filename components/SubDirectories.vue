<template>
  <v-col>
    <v-row>폴더</v-row>
    <v-row>
      <template v-for="dir of directories" class="file">
        <div class="directory">
          <v-icon left @click="goDirectory(dir)">mdi-folder</v-icon>
          <span @click="goDirectory(dir)"> {{ dir.data().name }}</span>
          <button>
            <v-icon @click="renameModalOpen(dir)">mdi-pen</v-icon>
          </button>
          <button>
            <v-icon @click="moveModalOpen(dir)">mdi-swap-horizontal</v-icon>
          </button>
          <button>
            <v-icon @click="removeDirectory(dir)">mdi-close-box</v-icon>
          </button>
        </div>
      </template>
    </v-row>
    <ModalRename
      :isShowed="this.isRename"
      :title="'이름 바꾸기'"
      @rename-close="renameModalClose"
      @rename-ok="renameModalOk">
    </ModalRename>
    <ModalMove
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
  name: "SubDirectories",
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
      directories: [],
      fileUrls: [],
      renameDirectory: '', //obj
      moveDirectory:'',
      moveDirectoryId:''
    }
  },
  mounted() {
    this.viewDirectories();
  },
  methods: {
    viewDirectories() {
      this.directories = [];
      const dirStorageRef = this.$fire.firestore
        .collection(`users/${this.$fire.auth.currentUser.uid}/directories`);
      dirStorageRef.orderBy('name').where('parentId', '==', this.parentId)
        .onSnapshot((async querySnapshot => {
          this.directories = querySnapshot.docs;
          // console.log(this.directories);
        }));
    },
    goDirectory(dir) {
      this.$router.push(`/directories/${dir.id}`);
    },
    async removeDirectory(dir) {
      // console.log("remove!", dir);
      const delConfirm = confirm("폴더와 하위 항목들을 완전히 삭제하시겠습니까?");
      if (delConfirm == true) {
        let subDirectories = [dir.id];
        let subFiles = [];

        // delete sub directories
        while (subDirectories.length != 0) {
          // console.log("Start loop");
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
        // console.log("end loop");
        this.viewDirectories();
      }
    },
    moveModalOpen(dir){
      this.moveDirectory = dir;
      this.isMove = true;
    },
    moveModalClose(){
      this.isMove = false;
    },
    async moveModalOk(dir){
      const selectDirectory = dir;
      if (selectDirectory.id == this.moveDirectory.id) return alert('선택한 폴더로는 이동할 수 없습니다.');
      await this.$fire.firestore
        .doc(`users/${this.$fire.auth.currentUser.uid}/directories/${this.moveDirectory.id}`)
        .update({
          parentId: selectDirectory.id,
        });
      this.isMove = false;
    },
    renameModalOpen(dir) {
      this.isRename = true;
      this.renameDirectory = dir;
    },
    renameModalClose() {
      this.isRename = false;
    },
    async renameModalOk(rename) {
      if (rename == undefined) {
        return alert("이름을 입력해주세요");
      } else {
        await this.$fire.firestore
          .doc(`users/${this.$fire.auth.currentUser.uid}/directories/${this.renameDirectory.id}`)
          .update({
            name: rename,
          });
        this.isRename = false;
        this.viewDirectories();
      }
    },
  },
}
</script>

<style scoped>
.directory {
  display: inline-block;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  border: solid 1px cornflowerblue;
}

</style>
